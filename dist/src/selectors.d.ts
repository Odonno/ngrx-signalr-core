import { BaseSignalRStoreState } from "./reducer";
import { SignalRHubState } from "./hubStatus";
interface AppState {
    signalr: BaseSignalRStoreState;
}
declare type HubDefinition = {
    hubName: string;
    url: string;
};
export declare const selectSignalrState: (state: AppState) => BaseSignalRStoreState;
export declare const selectHubsStatuses: import("@ngrx/store").MemoizedSelector<AppState, import("./hubStatus").SignalRHubStatus[], import("@ngrx/store/src/selector").DefaultProjectorFn<import("./hubStatus").SignalRHubStatus[]>>;
export declare const selectHubStatus: import("@ngrx/store").MemoizedSelectorWithProps<AppState, HubDefinition, import("./hubStatus").SignalRHubStatus, import("@ngrx/store/src/selector").DefaultProjectorFn<import("./hubStatus").SignalRHubStatus>>;
export declare const selectAreAllHubsConnected: import("@ngrx/store").MemoizedSelector<AppState, boolean, import("@ngrx/store/src/selector").DefaultProjectorFn<boolean>>;
declare type SelectHasHubStateProps = HubDefinition & {
    state: SignalRHubState;
};
export declare const selectHasHubState: import("@ngrx/store").MemoizedSelectorWithProps<AppState, SelectHasHubStateProps, boolean, import("@ngrx/store/src/selector").DefaultProjectorFn<boolean>>;
export {};
