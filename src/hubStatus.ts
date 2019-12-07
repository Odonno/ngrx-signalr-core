import { HubConnectionState } from '@aspnet/signalr';
import { HubKeyDefinition } from './models';

export const unstarted = 'unstarted';
export const connected = 'connected';
export const disconnected = 'disconnected';

export const SignalRStates = {
    unstarted,
    connected,
    disconnected
}

export const toSignalRState = (state: HubConnectionState): string => {
    switch (state) {
        case HubConnectionState.Connected:
            return connected;
        case HubConnectionState.Disconnected:
            return disconnected;
    }
}

export type SignalRHubState =
    | typeof unstarted
    | typeof connected
    | typeof disconnected;

export type SignalRHubStatus = HubKeyDefinition & {
    state: SignalRHubState;
};