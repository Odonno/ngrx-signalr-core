import { Observable, Subject, from, throwError, timer } from 'rxjs';
import { IHttpConnectionOptions, HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { testingEnabled, hubCreationFunc } from './testing';
import { share } from 'rxjs/operators';

const getOrCreateSubject = <T>(subjects: { [name: string]: Subject<any> }, event: string): Subject<T> => {
    return subjects[event] || (subjects[event] = new Subject<T>());
}

const createConnection = (url: string, options?: IHttpConnectionOptions | undefined) => {
    if (!options) {
        return new HubConnectionBuilder()
            .withUrl(url)
            .build();
    }

    return new HubConnectionBuilder()
        .withUrl(url, options)
        .build();
};

export interface ISignalRHub {
    hubName: string;
    url: string;
    options: IHttpConnectionOptions | undefined;

    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<Error | undefined>;

    start(): Observable<void>;
    on<T>(eventName: string): Observable<T>;
    stream<T>(methodName: string, ...args: any[]): Observable<T>;
    send<T>(methodName: string, ...args: any[]): Observable<T>;
    hasSubscriptions(): boolean;
}

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

    start() {
        if (!this._connection) {
            this._connection = createConnection(this.url, this.options);
            this._connection.onclose(error => {
                this._errorSubject.next(error);
                this._stateSubject.next('disconnected');
            });
        }

        this._connection.start()
            .then(_ => {
                this._startSubject.next();
                this._stateSubject.next('connected');
            })
            .catch(error => this._startSubject.error(error));

        return this._startSubject.asObservable();
    }

    on<T>(eventName: string) {
        if (!this._connection) {
            this._connection = createConnection(this.url, this.options);
            this._connection.onclose(error => {
                this._errorSubject.next(error);
                this._stateSubject.next('disconnected');
            });
        }

        const subject = getOrCreateSubject<T>(this._subjects, eventName);
        this._connection.on(eventName, (data: T) => subject.next(data))

        return subject.asObservable();
    }

    stream<T>(methodName: string, ...args: any[]) {
        return new Observable<T>(
            observer => {
                if (!this._connection) {
                    this._connection = createConnection(this.url, this.options);
                    this._connection.onclose(error => {
                        this._errorSubject.next(error);
                        this._stateSubject.next('disconnected');
                    });
                }

                const stream = this._connection.stream(methodName, args);
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

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }
}

export abstract class SignalRTestingHub implements ISignalRHub {
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

    start() {
        timer(100).subscribe(_ => {
            this._startSubject.next();
            this._stateSubject.next('connected');
        });

        return this._startSubject.asObservable();
    }

    abstract on<T>(eventName: string): Observable<T>;
    abstract stream<T>(methodName: string, ...args: any[]): Observable<T>;
    abstract send<T>(methodName: string, ...args: any[]): Observable<T>;

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }
}

const hubs: ISignalRHub[] = [];

export function findHub(hubName: string, url: string): ISignalRHub | undefined;
export function findHub({ hubName, url }: { hubName: string, url: string }): ISignalRHub | undefined;
export function findHub(x: string | { hubName: string, url: string }, url?: string | undefined): ISignalRHub | undefined {
    if (typeof x === 'string') {
        return hubs.filter(h => h.hubName === x && h.url === url)[0];
    }
    return hubs.filter(h => h.hubName === x.hubName && h.url === x.url)[0];
};

export const createHub = (hubName: string, url: string, options?: IHttpConnectionOptions | undefined): ISignalRHub | undefined => {
    if (testingEnabled) {
        const hub = hubCreationFunc(hubName, url, options);
        if (hub) {
            hubs.push(hub);
            return hub;
        }
        return undefined;
    }

    const hub = new SignalRHub(hubName, url, options);
    hubs.push(hub);
    return hub;
}