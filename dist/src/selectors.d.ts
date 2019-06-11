import { BaseSignalRStoreState } from "./reducer";
interface AppState {
    signalr: BaseSignalRStoreState;
}
export declare const selectSignalrState: (state: AppState) => BaseSignalRStoreState;
export declare const selectHubsStatuses: import("@ngrx/store").MemoizedSelector<AppState, import("./hubStatus").SignalRHubStatus[], import("@ngrx/store/src/selector").DefaultProjectorFn<import("./hubStatus").SignalRHubStatus[]>>;
export declare const selectHubStatus: import("@ngrx/store").MemoizedSelectorWithProps<AppState, {
    hubName: string;
    url: string;
}, import("./hubStatus").SignalRHubStatus, import("@ngrx/store/src/selector").DefaultProjectorFn<import("./hubStatus").SignalRHubStatus>>;
export declare const selectAreAllHubsConnected: import("@ngrx/store").MemoizedSelector<AppState, boolean, import("@ngrx/store/src/selector").DefaultProjectorFn<boolean>>;
export {};
