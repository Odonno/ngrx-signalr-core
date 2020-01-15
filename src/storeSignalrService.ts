import { Injectable } from "@angular/core";
import { IHttpConnectionOptions } from "@microsoft/signalr";
import { createHub, findHub } from "./hub";
import { HubKeyDefinition } from "./models";

@Injectable({
    providedIn: 'root',
})
export class StoreSignalRService {
    findHub(x: string | HubKeyDefinition, url?: string | undefined) {
        if (typeof x === 'string') {
            return findHub(x, url || '');
        } else {
            return findHub(x.hubName, x.url);
        }
    }

    createHub(hubName: string, url: string, options?: IHttpConnectionOptions | undefined) {
        return createHub(hubName, url, options);
    }
}