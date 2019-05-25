import { HubConnectionState } from '@aspnet/signalr';
declare const unstarted = "unstarted";
declare const connected = "connected";
declare const disconnected = "disconnected";
export declare const SignalRStates: {
    unstarted: string;
    connected: string;
    disconnected: string;
};
export declare const toSignalRState: (state: HubConnectionState) => string;
export declare type SignalRHubState = typeof unstarted | typeof connected | typeof disconnected;
export declare type SignalRHubStatus = {
    hubName: string;
    url: string;
    state: SignalRHubState | undefined;
};
export {};
