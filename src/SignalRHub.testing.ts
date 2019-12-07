import { ISignalRHub } from "./SignalRHub.interface";
import { Subject, Observable, timer } from "rxjs";
import { IHttpConnectionOptions } from "@aspnet/signalr";

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
    abstract off(eventName: string): void;
    abstract stream<T>(methodName: string, ...args: any[]): Observable<T>;
    abstract send<T>(methodName: string, ...args: any[]): Observable<T>;
    abstract sendStream<T>(methodName: string, subject: Subject<T>): Observable<void>;

    hasSubscriptions(): boolean {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }
}