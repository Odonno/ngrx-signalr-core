import { HubConnectionState } from '@aspnet/signalr';
import { HubKeyDefinition } from './models';
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
export declare type SignalRHubStatus = HubKeyDefinition & {
    state: SignalRHubState;
};
export {};
