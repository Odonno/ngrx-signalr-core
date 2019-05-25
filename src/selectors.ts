import { BaseSignalRStoreState } from "./reducer";
import { DEFAULT_SIGNALR_FEATURENAME } from "./constants";
import { createSelector } from "@ngrx/store";

interface AppState {
    signalr: BaseSignalRStoreState;
}

export const selectSignalrState = (state: AppState) => state[DEFAULT_SIGNALR_FEATURENAME];

export const selectHubsStatuses = createSelector(
    selectSignalrState,
    state => state.hubStatuses
);
export const selectHubStatus = createSelector(
    selectSignalrState,
    (state: BaseSignalRStoreState, { hubName, url }: { hubName: string, url: string }) =>
        state.hubStatuses.filter(hs => hs.hubName === hubName && hs.url === url)[0],
);
export const selectAreAllHubsConnected = createSelector(
    selectHubsStatuses,
    (hubStatuses) => hubStatuses.every(hs => hs.state === 'connected')
);