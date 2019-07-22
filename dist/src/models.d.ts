import { Action } from "@ngrx/store";
import { IHttpConnectionOptions } from "@aspnet/signalr";
export declare type HubKeyDefinition = {
    hubName: string;
    url: string;
};
export declare type HubFullDefinition = HubKeyDefinition & {
    options?: IHttpConnectionOptions | undefined;
};
export interface HubAction extends Action {
    hubName: string;
    url: string;
}
