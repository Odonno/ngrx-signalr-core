import { Subject, from, throwError, timer } from 'rxjs';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { testingEnabled, hubCreationFunc } from './testing';
const getOrCreateSubject = (subjects, event) => {
    return subjects[event] || (subjects[event] = new Subject());
};
const createConnection = (url, options) => {
    if (!options) {
        return new HubConnectionBuilder()
            .withUrl(url)
            .build();
    }
    return new HubConnectionBuilder()
        .withUrl(url, options)
        .build();
};
export class SignalRHub {
    constructor(hubName, url, options) {
        this.hubName = hubName;
        this.url = url;
        this.options = options;
        this._startSubject = new Subject();
        this._stateSubject = new Subject();
        this._errorSubject = new Subject();
        this._subjects = {};
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
    on(eventName) {
        if (!this._connection) {
            this._connection = createConnection(this.url, this.options);
            this._connection.onclose(error => {
                this._errorSubject.next(error);
                this._stateSubject.next('disconnected');
            });
        }
        const subject = getOrCreateSubject(this._subjects, eventName);
        this._connection.on(eventName, (data) => subject.next(data));
        return subject.asObservable();
    }
    send(methodName, ...args) {
        if (!this._connection) {
            return throwError('The connection has not been started yet. Please start the connection by invoking the start method before attempting to send a message to the server.');
        }
        return from(this._connection.invoke(methodName, args));
    }
    hasSubscriptions() {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }
}
export class SignalRTestingHub {
    constructor(hubName, url, options) {
        this.hubName = hubName;
        this.url = url;
        this.options = options;
        this._startSubject = new Subject();
        this._stateSubject = new Subject();
        this._errorSubject = new Subject();
        this._subjects = {};
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
    hasSubscriptions() {
        for (let key in this._subjects) {
            if (this._subjects.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }
}
const hubs = [];
export function findHub(x, url) {
    if (typeof x === 'string') {
        return hubs.filter(h => h.hubName === x && h.url === url)[0];
    }
    return hubs.filter(h => h.hubName === x.hubName && h.url === x.url)[0];
}
;
export const createHub = (hubName, url, options) => {
    if (testingEnabled) {
        const hub = hubCreationFunc(hubName, url, options);
        hubs.push(hub);
        return hub;
    }
    const hub = new SignalRHub(hubName, url, options);
    hubs.push(hub);
    return hub;
};
