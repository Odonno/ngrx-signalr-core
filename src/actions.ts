import { IHttpConnectionOptions } from '@aspnet/signalr';

export const SIGNALR_CREATE_HUB = '@ngrx/signalr/createHub';
export type SignalRCreateHubAction = {
    type: typeof SIGNALR_CREATE_HUB;
    hubName: string;
    url: string;
    options?: IHttpConnectionOptions | undefined;
};
export const createSignalRHub = (hubName: string, url: string, options?: IHttpConnectionOptions | undefined) => 
    ({ type: SIGNALR_CREATE_HUB, hubName, url, options });

export const SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
export type SignalRHubUnstartedAction = {
    type: typeof SIGNALR_HUB_UNSTARTED;
    hubName: string;
    url: string;
};

export const SIGNALR_START_HUB = '@ngrx/signalr/startHub';
export type SignalRStartHubAction = {
    type: typeof SIGNALR_START_HUB;
    hubName: string;
    url: string;
};
export const startSignalRHub = (hubName: string, url: string) => 
    ({ type: SIGNALR_START_HUB, hubName, url });

export const SIGNALR_RECONNECT_HUB = '@ngrx/signalr/reconnectHub';
export type SignalRReconnectHubAction = {
    type: typeof SIGNALR_RECONNECT_HUB;
    hubName: string;
    url: string;
};
export const reconnectSignalRHub = (hubName: string, url: string) => 
    ({ type: SIGNALR_RECONNECT_HUB, hubName, url });

export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
export type SignalRHubFailedToStartAction = {
    type: typeof SIGNALR_HUB_FAILED_TO_START;
    hubName: string;
    url: string;
    error: any;
};

export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
export type SignalRConnectedAction = {
    type: typeof SIGNALR_CONNECTED;
    hubName: string;
    url: string;
};

export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
export type SignalRDisconnectedAction = {
    type: typeof SIGNALR_DISCONNECTED;
    hubName: string;
    url: string;
};

export const SIGNALR_ERROR = '@ngrx/signalr/error';
export type SignalRErrorAction = {
    type: typeof SIGNALR_ERROR;
    hubName: string;
    url: string;
    error: any;
};

export type SignalRAction =
    | SignalRCreateHubAction
    | SignalRStartHubAction
    | SignalRReconnectHubAction
    | SignalRHubUnstartedAction 
    | SignalRHubFailedToStartAction
    | SignalRConnectedAction
    | SignalRDisconnectedAction
    | SignalRErrorAction;