import { BaseSignalRStoreState } from "./reducer";
import { SignalRHubState } from "./hubStatus";
import { HubKeyDefinition } from "./models";
interface RootState {
    signalr: BaseSignalRStoreState;
}
export declare const selectSignalrState: (state: RootState) => BaseSignalRStoreState;
export declare const selectHubsStatuses: import("@ngrx/store").MemoizedSelector<RootState, import("./hubStatus").SignalRHubStatus[], import("@ngrx/store/src/selector").DefaultProjectorFn<import("./hubStatus").SignalRHubStatus[]>>;
export declare const selectHubStatus: import("@ngrx/store").MemoizedSelectorWithProps<RootState, HubKeyDefinition, import("./hubStatus").SignalRHubStatus, import("@ngrx/store/src/selector").DefaultProjectorFn<import("./hubStatus").SignalRHubStatus>>;
export declare const selectAreAllHubsConnected: import("@ngrx/store").MemoizedSelector<RootState, boolean, import("@ngrx/store/src/selector").DefaultProjectorFn<boolean>>;
declare type SelectHasHubStateProps = HubKeyDefinition & {
    state: SignalRHubState;
};
export declare const selectHasHubState: import("@ngrx/store").MemoizedSelectorWithProps<RootState, SelectHasHubStateProps, boolean, import("@ngrx/store/src/selector").DefaultProjectorFn<boolean>>;
export {};
