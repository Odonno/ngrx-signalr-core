import { IHttpConnectionOptions } from '@aspnet/signalr';
export declare const createSignalRHub: import("@ngrx/store").ActionCreator<"@ngrx/signalr/createHub", (props: {
    hubName: string;
    url: string;
    options?: IHttpConnectionOptions | undefined;
}) => {
    hubName: string;
    url: string;
    options?: IHttpConnectionOptions | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/createHub">>;
export declare const SIGNALR_HUB_UNSTARTED = "@ngrx/signalr/hubUnstarted";
export declare const signalrHubUnstarted: import("@ngrx/store").ActionCreator<"@ngrx/signalr/hubUnstarted", (props: {
    hubName: string;
    url: string;
}) => {
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubUnstarted">>;
export declare const startSignalRHub: import("@ngrx/store").ActionCreator<"@ngrx/signalr/startHub", (props: {
    hubName: string;
    url: string;
}) => {
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">>;
export declare const reconnectSignalRHub: import("@ngrx/store").ActionCreator<"@ngrx/signalr/reconnectHub", (props: {
    hubName: string;
    url: string;
}) => {
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/reconnectHub">>;
export declare const SIGNALR_HUB_FAILED_TO_START = "@ngrx/signalr/hubFailedToStart";
export declare const signalrHubFailedToStart: import("@ngrx/store").ActionCreator<"@ngrx/signalr/hubFailedToStart", (props: {
    hubName: string;
    url: string;
    error: any;
}) => {
    hubName: string;
    url: string;
    error: any;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubFailedToStart">>;
export declare const SIGNALR_CONNECTED = "@ngrx/signalr/connected";
export declare const signalrConnected: import("@ngrx/store").ActionCreator<"@ngrx/signalr/connected", (props: {
    hubName: string;
    url: string;
}) => {
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connected">>;
export declare const SIGNALR_DISCONNECTED = "@ngrx/signalr/disconnected";
export declare const signalrDisconnected: import("@ngrx/store").ActionCreator<"@ngrx/signalr/disconnected", (props: {
    hubName: string;
    url: string;
}) => {
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/disconnected">>;
export declare const SIGNALR_ERROR = "@ngrx/signalr/error";
export declare const signalrError: import("@ngrx/store").ActionCreator<"@ngrx/signalr/error", (props: {
    hubName: string;
    url: string;
    error: any;
}) => {
    hubName: string;
    url: string;
    error: any;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/error">>;
export declare const hubNotFound: import("@ngrx/store").ActionCreator<"@ngrx/signalr/hubNotFound", (props: {
    hubName: string;
    url: string;
}) => {
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubNotFound">>;
declare const signalRAction: ({
    hubName: string;
    url: string;
    options?: IHttpConnectionOptions | undefined;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/createHub">) | ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubUnstarted">) | ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">) | ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/reconnectHub">) | ({
    hubName: string;
    url: string;
    error: any;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubFailedToStart">) | ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connected">) | ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/disconnected">) | ({
    hubName: string;
    url: string;
    error: any;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/error">) | ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubNotFound">);
export declare type SignalRAction = typeof signalRAction;
export {};
