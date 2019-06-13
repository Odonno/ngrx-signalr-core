import { SignalRTestingHub } from "./hub";
import { IHttpConnectionOptions } from "@aspnet/signalr";

type HubCreationFunc = 
    (hubName: string, url: string, options?: IHttpConnectionOptions | undefined) => SignalRTestingHub | undefined;

export let testingEnabled = false;
export let hubCreationFunc: HubCreationFunc;

export const enableTesting = (func: HubCreationFunc) => {
    testingEnabled = true;
    hubCreationFunc = func;
}