import { IHttpConnectionOptions } from '@aspnet/signalr';
export declare const SIGNALR_CREATE_HUB = "@ngrx/signalr/createHub";
export declare type SignalRCreateHubAction = {
    type: typeof SIGNALR_CREATE_HUB;
    hubName: string;
    url: string;
    options?: IHttpConnectionOptions | undefined;
};
export declare const createSignalRHub: (hubName: string, url: string, options?: IHttpConnectionOptions | undefined) => {
    type: string;
    hubName: string;
    url: string;
    options: IHttpConnectionOptions | undefined;
};
export declare const SIGNALR_HUB_UNSTARTED = "@ngrx/signalr/hubUnstarted";
export declare type SignalRHubUnstartedAction = {
    type: typeof SIGNALR_HUB_UNSTARTED;
    hubName: string;
    url: string;
};
export declare const SIGNALR_START_HUB = "@ngrx/signalr/startHub";
export declare type SignalRStartHubAction = {
    type: typeof SIGNALR_START_HUB;
    hubName: string;
    url: string;
};
export declare const startSignalRHub: (hubName: string, url: string) => {
    type: string;
    hubName: string;
    url: string;
};
export declare const SIGNALR_RECONNECT_HUB = "@ngrx/signalr/reconnectHub";
export declare type SignalRReconnectHubAction = {
    type: typeof SIGNALR_RECONNECT_HUB;
    hubName: string;
    url: string;
};
export declare const reconnectSignalRHub: (hubName: string, url: string) => {
    type: string;
    hubName: string;
    url: string;
};
export declare const SIGNALR_HUB_FAILED_TO_START = "@ngrx/signalr/hubFailedToStart";
export declare type SignalRHubFailedToStartAction = {
    type: typeof SIGNALR_HUB_FAILED_TO_START;
    hubName: string;
    url: string;
    error: any;
};
export declare const SIGNALR_CONNECTED = "@ngrx/signalr/connected";
export declare type SignalRConnectedAction = {
    type: typeof SIGNALR_CONNECTED;
    hubName: string;
    url: string;
};
export declare const SIGNALR_DISCONNECTED = "@ngrx/signalr/disconnected";
export declare type SignalRDisconnectedAction = {
    type: typeof SIGNALR_DISCONNECTED;
    hubName: string;
    url: string;
};
export declare const SIGNALR_ERROR = "@ngrx/signalr/error";
export declare type SignalRErrorAction = {
    type: typeof SIGNALR_ERROR;
    hubName: string;
    url: string;
    error: any;
};
export declare type SignalRAction = SignalRCreateHubAction | SignalRStartHubAction | SignalRReconnectHubAction | SignalRHubUnstartedAction | SignalRHubFailedToStartAction | SignalRConnectedAction | SignalRDisconnectedAction | SignalRErrorAction;
