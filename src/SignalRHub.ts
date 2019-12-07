import { ISignalRHub } from "./SignalRHub.interface";
import { HubConnection, IHttpConnectionOptions } from "@aspnet/signalr";
import { Subject, Observable, throwError, from } from "rxjs";
import { share } from "rxjs/operators";
import { createConnection, getOrCreateSubject } from "./hub";

export class SignalRHub implements ISignalRHub {
    private _connection: HubConnection | undefined;
    private _startSubject = new Subject<void>();
    private _stateSubject = new Subject<string>();
    private _errorSubject = new Subject<Error | undefined>();
    private _subjects: { [eventName: string]: Subject<any> } = {};

    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<Error | undefined>;

    constructor(public hubName: string, public url: string, public options: IHttpConnectionOptions | undefined) {
        this.start$ = this._startSubject.asObservable();
        this.state$ = this._stateSubject.asObservable();
        this.error$ = this._errorSubject.asObservable();
    }

    private ensureConnectionOpened() {
        if (!this._connection) {
            this._connection = createConnection(this.url, this.options);
            this._connection.onclose(error => {
                this._errorSubject.next(error);
                this._stateSubject.next('disconnected');
            });
        }

        return this._connection;
    }

    start() {
        const connection = this.ensureConnectionOpened();

        connection.start()
            .then(_ => {
                this._startSubject.next();
                this._stateSubject.next('connected');
            })
            .catch(error => this._startSubject.error(error));

        return this._startSubject.asObservable();
    }

    on<T>(eventName: string) {
        const connection = this.ensureConnectionOpened();

        const subject = getOrCreateSubject<T>(this._subjects, eventName);
        connection.on(eventName, (data: T) => subject.next(data))

        return subject.asObservable();
    }

    off(eventName: string) {
        if (!this._connection) {
            return throwError('The connection has not been started yet. Please start the connection by invoking the start method before attempting to stop listening from the server.');
        }

        this._connection.off(eventName);
    }

    stream<T>(methodName: string, ...args: any[]) {
        return new Observable<T>(
            observer => {
                const connection = this.ensureConnectionOpened();

                const stream = connection.stream(methodName, args);
                const subscription = stream.subscribe(observer);

                return () => subscription.dispose();
            }
        ).pipe(
            share()
        );
    }

    send<T extends any>(methodName: string, ...args: any[]) {
        if (!this._connection) {
            return throwError('The connection has not been started yet. Please start the connection by invoking the start method before attempting to send a message to the server.');
        }

        return from(
            this._connection.invoke<T>(methodName, ...args)
        );
    }

    sendStream<T>(methodName: string, subject: Subject<T>) {
        const connection = this.ensureConnectionOpened();

        return from(
            connection.send(methodName, subject)
        );
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