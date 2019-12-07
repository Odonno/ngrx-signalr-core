import { Subject } from 'rxjs';
import { IHttpConnectionOptions, HubConnectionBuilder } from '@aspnet/signalr';
import { testingEnabled, hubCreationFunc } from './testing';
import { ISignalRHub } from './SignalRHub.interface';
import { SignalRHub } from './SignalRHub';

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
};

export const getOrCreateSubject = <T>(subjects: { [name: string]: Subject<any> }, event: string): Subject<T> => {
    return subjects[event] || (subjects[event] = new Subject<T>());
};

export const createConnection = (url: string, options?: IHttpConnectionOptions | undefined) => {
    if (!options) {
        return new HubConnectionBuilder()
            .withUrl(url)
            .build();
    }

    return new HubConnectionBuilder()
        .withUrl(url, options)
        .build();
};