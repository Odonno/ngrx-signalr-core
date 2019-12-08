import { HubConnectionState } from '@aspnet/signalr';
import { HubKeyDefinition } from './models';

export const unstarted = 'unstarted';
export const connected = 'connected';
export const disconnected = 'disconnected';

/**
 * List of given states a SignalR can be.
 */
export const SignalRStates = {
    unstarted,
    connected,
    disconnected
};

/**
 * Convert a hub connection state to the internal state value.
 * @param state The state of the hub connection.
 */
export const toSignalRState = (state: HubConnectionState): string => {
    switch (state) {
        case HubConnectionState.Connected:
            return connected;
        case HubConnectionState.Disconnected:
            return disconnected;
    }
};

/**
 * Connection state definition of a SignalR hub.
 */
export type SignalRHubState =
    | typeof unstarted
    | typeof connected
    | typeof disconnected;

/**
 * Status definition of a SignalR hub.
 */
export type SignalRHubStatus = HubKeyDefinition & {
    state: SignalRHubState;
};