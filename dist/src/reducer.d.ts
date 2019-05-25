import { SignalRAction } from "./actions";
import { SignalRHubStatus } from "./hubStatus";
export interface BaseSignalRStoreState {
    hubStatuses: SignalRHubStatus[];
}
export declare function signalrReducer(state: BaseSignalRStoreState | undefined, action: SignalRAction): BaseSignalRStoreState;
