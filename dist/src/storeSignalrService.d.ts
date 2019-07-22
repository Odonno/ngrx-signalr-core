import { IHttpConnectionOptions } from "@aspnet/signalr";
import { HubKeyDefinition } from "./models";
export declare class StoreSignalRService {
    findHub(x: string | HubKeyDefinition, url?: string | undefined): import("./hub").ISignalRHub | undefined;
    createHub(hubName: string, url: string, options?: IHttpConnectionOptions | undefined): import("./hub").ISignalRHub | undefined;
}
