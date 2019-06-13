import { SignalRTestingHub } from "./hub";
import { IHttpConnectionOptions } from "@aspnet/signalr";
declare type HubCreationFunc = (hubName: string, url: string, options?: IHttpConnectionOptions | undefined) => SignalRTestingHub | undefined;
export declare let testingEnabled: boolean;
export declare let hubCreationFunc: HubCreationFunc;
export declare const enableTesting: (func: HubCreationFunc) => void;
export {};
