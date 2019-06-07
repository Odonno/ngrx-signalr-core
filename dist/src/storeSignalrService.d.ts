import { IHttpConnectionOptions } from "@aspnet/signalr";
export declare class StoreSignalRService {
    findHub(x: string | {
        hubName: string;
        url: string;
    }, url?: string | undefined): import("./hub").ISignalRHub | undefined;
    createHub(hubName: string, url: string, options?: IHttpConnectionOptions | undefined): import("./hub").ISignalRHub;
}
