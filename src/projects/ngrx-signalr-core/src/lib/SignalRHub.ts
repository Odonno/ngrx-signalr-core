import { ISignalRHub } from "./SignalRHub.interface";
import {
  HubConnection,
  IHttpConnectionOptions,
  IRetryPolicy,
  IHubProtocol,
  Subject as SignalRSubject,
} from "@microsoft/signalr";
import { Subject, Observable, throwError, from } from "rxjs";
import { share } from "rxjs/operators";
import { connected, disconnected, reconnecting } from "./hubStatus";
import { createConnection } from "./signalr";

export class SignalRHub implements ISignalRHub {
  private _connection: HubConnection | undefined;
  private _startSubject = new Subject<void>();
  private _stopSubject = new Subject<void>();
  private _stateSubject = new Subject<string>();
  private _errorSubject = new Subject<Error | undefined>();
  private _subjects: { [eventName: string]: Subject<any> } = {};

  start$: Observable<void>;
  stop$: Observable<void>;
  state$: Observable<string>;
  error$: Observable<Error | undefined>;

  get connectionId() {
    return this._connection?.connectionId ?? undefined;
  }

  constructor(
    public hubName: string,
    public url: string,
    public options: IHttpConnectionOptions | undefined,
    public automaticReconnect: boolean | number[] | IRetryPolicy | undefined,
    public withHubProtocol: IHubProtocol
  ) {
    this.start$ = this._startSubject.asObservable();
    this.stop$ = this._stopSubject.asObservable();
    this.state$ = this._stateSubject.asObservable();
    this.error$ = this._errorSubject.asObservable();
  }

  private ensureConnectionOpened() {
    if (!this._connection) {
      this._connection = createConnection(
        this.url,
        this.options,
        this.automaticReconnect,
        this.withHubProtocol
      );

      this._connection.onclose((error) => {
        this._errorSubject.next(error);
        this._stateSubject.next(disconnected);
      });
      this._connection.onreconnecting(() => {
        this._stateSubject.next(reconnecting);
      });
      this._connection.onreconnected(() => {
        this._stateSubject.next(connected);
      });
    }

    return this._connection;
  }

  start() {
    const connection = this.ensureConnectionOpened();

    connection
      .start()
      .then((_) => {
        this._startSubject.next();
        this._stateSubject.next(connected);
      })
      .catch((error) => this._errorSubject.next(error));

    return this._startSubject.asObservable();
  }

  stop() {
    if (!this._connection) {
      return throwError(
        "The connection has not been started yet. Please start the connection by invoking the start method before attempting to stop listening from the server."
      );
    }

    this._connection
      .stop()
      .then((_) => {
        this._stopSubject.next();
        this._stateSubject.next(disconnected);
      })
      .catch((error) => this._errorSubject.next(error));

    return this._stopSubject.asObservable();
  }

  on<T>(eventName: string) {
    return new Observable<T>((observer) => {
      const connection = this.ensureConnectionOpened();

      const callback = (data: T) => observer.next(data);

      connection.on(eventName, callback);

      const errorSubscription = this._errorSubject.subscribe(() => {
        observer.error(new Error(`The connection has been closed.`));
      });
      const stopSubscription = this._stopSubject.subscribe(() => {
        observer.complete();
      });

      return () => {
        errorSubscription.unsubscribe();
        stopSubscription.unsubscribe();
        connection.off(eventName, callback);
      };
    }).pipe(share());
  }

  stream<T>(methodName: string, ...args: any[]) {
    return new Observable<T>((observer) => {
      const connection = this.ensureConnectionOpened();

      const stream = connection.stream(methodName, ...args);
      const subscription = stream.subscribe(observer);

      return () => subscription.dispose();
    }).pipe(share());
  }

  send<T extends any>(methodName: string, ...args: any[]) {
    if (!this._connection) {
      return throwError(
        "The connection has not been started yet. Please start the connection by invoking the start method before attempting to send a message to the server."
      );
    }

    return from(this._connection.invoke<T>(methodName, ...args));
  }

  sendStream<T>(methodName: string, observable: Observable<T>) {
    const connection = this.ensureConnectionOpened();

    const internalSubject = new SignalRSubject<T>();
    observable.subscribe(internalSubject);

    connection.send(methodName, internalSubject);
  }

  hasSubscriptions(): boolean {
    for (let key in this._subjects) {
      if (this._subjects.hasOwnProperty(key)) {
        return true;
      }
    }

    return false;
  }
}
