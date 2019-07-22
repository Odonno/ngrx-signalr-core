import { Action } from "@ngrx/store";
import { IHttpConnectionOptions } from "@aspnet/signalr";

export type HubKeyDefinition = {
    hubName: string;
    url: string;
};

export type HubFullDefinition = HubKeyDefinition & {
    options?: IHttpConnectionOptions | undefined
};

export interface HubAction extends Action {
    hubName: string;
    url: string;
}