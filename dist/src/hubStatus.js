import { HubConnectionState } from '@aspnet/signalr';
const unstarted = 'unstarted';
const connected = 'connected';
const disconnected = 'disconnected';
export const SignalRStates = {
    unstarted,
    connected,
    disconnected
};
export const toSignalRState = (state) => {
    switch (state) {
        case HubConnectionState.Connected:
            return connected;
        case HubConnectionState.Disconnected:
            return disconnected;
    }
};
