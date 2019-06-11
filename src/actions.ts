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

export const reconnectSignalRHub = createAction(
    '@ngrx/signalr/reconnectHub',
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
export const signalrHubFailedToStart = createAction(
    '@ngrx/signalr/hubFailedToStart',
    props<{ hubName: string, url: string, error: any }>()
);

export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
export const signalrConnected = createAction(
    '@ngrx/signalr/connected',
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
export const signalrDisconnected = createAction(
    '@ngrx/signalr/disconnected',
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_ERROR = '@ngrx/signalr/error';
export const signalrError = createAction(
    '@ngrx/signalr/error',
    props<{ hubName: string, url: string, error: any }>()
);

const signalRAction = union({
    createSignalRHub,
    signalrHubUnstarted,
    startSignalRHub,
    reconnectSignalRHub,
    signalrHubFailedToStart,
    signalrConnected,
    signalrDisconnected,
    signalrError
});
export type SignalRAction = typeof signalRAction;
