import { SignalRHubStatus } from "./hubStatus";
import { Action } from "@ngrx/store";
export interface BaseSignalRStoreState {
    hubStatuses: SignalRHubStatus[];
}
export declare function signalrReducer(state: BaseSignalRStoreState | undefined, action: Action): BaseSignalRStoreState;
