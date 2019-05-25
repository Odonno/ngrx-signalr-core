import { Observable } from 'rxjs';
import { IHttpConnectionOptions } from '@aspnet/signalr';
export declare class SignalRHub {
    hubName: string;
    url: string;
    options: IHttpConnectionOptions | undefined;
    private _connection;
    private _startSubject;
    private _stateSubject;
    private _errorSubject;
    private _subjects;
    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<Error | undefined>;
    constructor(hubName: string, url: string, options: IHttpConnectionOptions | undefined);
    start(): Observable<void>;
    on<T>(eventName: string): Observable<T>;
    send(methodName: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}
export declare function findHub(hubName: string, url: string): SignalRHub | undefined;
export declare function findHub({ hubName, url }: {
    hubName: string;
    url: string;
}): SignalRHub | undefined;
export declare const createHub: (hubName: string, url: string, options?: IHttpConnectionOptions | undefined) => SignalRHub;
