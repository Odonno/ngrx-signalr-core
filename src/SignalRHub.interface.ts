import { IHttpConnectionOptions } from "@microsoft/signalr";
import { Observable, Subject } from "rxjs";

/**
 * SignalR Hub instance that is built on top of @aspnet/signalr.
 */
export interface ISignalRHub {
    /**
     * Name of the hub.
     */
    hubName: string;
    /**
     * Url of the hub.
     */
    url: string;
    /**
     * Configuration options of the hub.
     */
    options: IHttpConnectionOptions | undefined;

    /**
     * Observable that gives info when a start event occured.
     */
    start$: Observable<void>;
    /**
     * Observable that gives info when a stop event occured.
     */
    stop$: Observable<void>;
    /**
     * Observable that gives info when a state changed event occured.
     */
    state$: Observable<string>;
    /**
     * Observable that gives info when an error occured.
     */
    error$: Observable<Error | undefined>;

    /**
     * Start the SignalR hub connection.
     */
    start(): Observable<void>;
    /**
     * Stop the SignalR hub connection.
     */
    stop(): Observable<void>;
    /**
     * Start to listen to a SignalR event from the server.
     * @param eventName Name of the event to listen.
     */
    on<T>(eventName: string): Observable<T>;
    /**
     * Stop to listen to a SignalR event from the server.
     * @param eventName Name of the event to listen.
     */
    off(eventName: string): void;
    /**
     * Receive realtime stream events from the server
     * @param methodName Name of the stream.
     * @param args Arguments to pass to the stream function (the hub function).
     */
    stream<T>(methodName: string, ...args: any[]): Observable<T>;
    /**
     * Call a function from the client to the server. 
     * @param methodName Name of the event to execute.
     * @param args Arguments to pass to the event function (the hub function).
     */
    send<T>(methodName: string, ...args: any[]): Observable<T>;
    /**
     * Send realtime stream events from the client to the server.
     * @param methodName Name of the stream.
     * @param observable Observable used to send data to the server.
     */
    sendStream<T>(methodName: string, observable: Observable<T>): void;
    /**
     * Indicates if there is at least one subscription living between the client and the server.
     */
    hasSubscriptions(): boolean;
}