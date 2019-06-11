import { createAction, props, union } from '@ngrx/store';
export const createSignalRHub = createAction('@ngrx/signalr/createHub', props());
export const SIGNALR_HUB_UNSTARTED = '@ngrx/signalr/hubUnstarted';
export const signalrHubUnstarted = createAction(SIGNALR_HUB_UNSTARTED, props());
export const startSignalRHub = createAction('@ngrx/signalr/startHub', props());
export const reconnectSignalRHub = createAction('@ngrx/signalr/reconnectHub', props());
export const SIGNALR_HUB_FAILED_TO_START = '@ngrx/signalr/hubFailedToStart';
export const signalrHubFailedToStart = createAction('@ngrx/signalr/hubFailedToStart', props());
export const SIGNALR_CONNECTED = '@ngrx/signalr/connected';
export const signalrConnected = createAction('@ngrx/signalr/connected', props());
export const SIGNALR_DISCONNECTED = '@ngrx/signalr/disconnected';
export const signalrDisconnected = createAction('@ngrx/signalr/disconnected', props());
export const SIGNALR_ERROR = '@ngrx/signalr/error';
export const signalrError = createAction('@ngrx/signalr/error', props());
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
