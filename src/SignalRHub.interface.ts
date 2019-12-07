import { IHttpConnectionOptions } from "@aspnet/signalr";
import { Observable, Subject } from "rxjs";

export interface ISignalRHub {
    hubName: string;
    url: string;
    options: IHttpConnectionOptions | undefined;

    start$: Observable<void>;
    stop$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<Error | undefined>;

    start(): Observable<void>;
    stop(): Observable<void>;
    on<T>(eventName: string): Observable<T>;
    off(eventName: string): void;
    stream<T>(methodName: string, ...args: any[]): Observable<T>;
    send<T>(methodName: string, ...args: any[]): Observable<T>;
    sendStream<T>(methodName: string, subject: Subject<T>): Observable<void>;
    hasSubscriptions(): boolean;
}