import { IHttpConnectionOptions } from '@aspnet/signalr';
import { createAction, props, union } from '@ngrx/store';

/**
 * Action to dispatch in order to create a new SignalR hub.
 */
export const createSignalRHub = createAction(
    '@ngrx/signalr/createHub',
    props<{ hubName: string, url: string, options?: IHttpConnectionOptions | undefined }>()
);

export const SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
/**
 * Action dispatched when a hub is at `unstarted` state.
 */
export const signalrHubUnstarted = createAction(
    SIGNALR_HUB_UNSTARTED,
    props<{ hubName: string, url: string }>()
);

/**
 * Action to dispatch in order to start a SignalR hub.
 */
export const startSignalRHub = createAction(
    '@ngrx/signalr/startHub',
    props<{ hubName: string, url: string }>()
);

/**
 * Action to dispatch in order to stop a SignalR hub.
 */
export const stopSignalRHub = createAction(
    '@ngrx/signalr/stopHub',
    props<{ hubName: string, url: string }>()
);

/**
 * Action to dispatch in order to reconnect to a SignalR hub.
 * It can be automatically dispatched using `createReconnectEffect` effect.
 */
export const reconnectSignalRHub = createAction(
    '@ngrx/signalr/reconnectHub',
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
/**
 * Action dispatched when a SignalR failed to start.
 */
export const signalrHubFailedToStart = createAction(
    SIGNALR_HUB_FAILED_TO_START,
    props<{ hubName: string, url: string, error: any }>()
);

export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
/**
 * Action dispatched when a hub is at `connected` state.
 */
export const signalrConnected = createAction(
    SIGNALR_CONNECTED,
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
/**
 * Action dispatched when a hub is at `disconnected` state.
 */
export const signalrDisconnected = createAction(
    SIGNALR_DISCONNECTED,
    props<{ hubName: string, url: string }>()
);

export const SIGNALR_ERROR = '@ngrx/signalr/error';
/**
 * Action dispatched when an error occured with a SignalR hub.
 */
export const signalrError = createAction(
    SIGNALR_ERROR,
    props<{ hubName: string, url: string, error: any }>()
);

/**
 * Action dispatched when a SignalR cannot be found, when doing any action.
 */
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
/**
 * Union of all possible actions to use on the ngrx-signalr-core package. 
 */
export type SignalRAction = typeof signalRAction;
