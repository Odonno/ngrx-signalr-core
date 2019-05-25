import { HubConnectionState } from '@aspnet/signalr';

const unstarted = 'unstarted';
const connected = 'connected';
const disconnected = 'disconnected';

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

export type SignalRHubStatus = {
    hubName: string;
    url: string;
    state: SignalRHubState | undefined;
}