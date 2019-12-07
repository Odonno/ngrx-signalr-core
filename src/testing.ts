import { IHttpConnectionOptions } from "@aspnet/signalr";
import { SignalRTestingHub } from "./SignalRHub.testing";

type HubCreationFunc = 
    (hubName: string, url: string, options?: IHttpConnectionOptions | undefined) => SignalRTestingHub | undefined;

export let testingEnabled = false;
export let hubCreationFunc: HubCreationFunc;

export const enableTesting = (func: HubCreationFunc) => {
    testingEnabled = true;
    hubCreationFunc = func;
}