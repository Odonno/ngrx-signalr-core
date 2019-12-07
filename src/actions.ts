import { IHttpConnectionOptions } from '@aspnet/signalr';
import { createAction, props, union } from '@ngrx/store';

export const createSignalRHub = createAction(
    '@ngrx/signalr/createHub',
    props<{ hubName: string, url: string, options?: IHttpConnectionOptions | undefined }>()
);

export const SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
export const signalrHubUnstarted = createAction(
    SIGNALR_HUB_UNSTARTED,
    props<{ hubName: string, url: string }>()
);

export const startSignalRHub = createAction(
    '@ngrx/signalr/startHub',
    props<{ hubName: string, url: string }>()
);

export const stopSignalRHub = createAction(
    '@ngrx/signalr/stopHub',
    props<{ hubName: string, url: string }>()
);

export const reconnectSignalRHub = createAction(
    '@ngrx/signalr/reconnectHub',
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
export const signalrHubFailedToStart = createAction(
    SIGNALR_HUB_FAILED_TO_START,
    props<{ hubName: string, url: string, error: any }>()
);

export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
export const signalrConnected = createAction(
    SIGNALR_CONNECTED,
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
export const signalrDisconnected = createAction(
    SIGNALR_DISCONNECTED,
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_ERROR = '@ngrx/signalr/error';
export const signalrError = createAction(
    SIGNALR_ERROR,
    props<{ hubName: string, url: string, error: any }>()
);

export const hubNotFound = createAction(
    '@ngrx/signalr/hubNotFound',
    props<{ hubName: string, url: string }>()
);

const signalRAction = union({
    createSignalRHub,
    signalrHubUnstarted,
    startSignalRHub,
    stopSignalRHub,
    reconnectSignalRHub,
    signalrHubFailedToStart,
    signalrConnected,
    signalrDisconnected,
    signalrError,
    hubNotFound
});
export type SignalRAction = typeof signalRAction;
