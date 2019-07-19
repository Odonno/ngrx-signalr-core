import { BaseSignalRStoreState } from "./reducer";
import { DEFAULT_SIGNALR_FEATURENAME } from "./constants";
import { createSelector } from "@ngrx/store";
import { SignalRHubState } from "./hubStatus";

interface RootState {
    signalr: BaseSignalRStoreState;
}

type HubDefinition = {
    hubName: string;
    url: string;
};

export const selectSignalrState = (state: RootState) => state[DEFAULT_SIGNALR_FEATURENAME];

export const selectHubsStatuses = createSelector(
    selectSignalrState,
    state => state.hubStatuses
);

type SelectHubStatusProps = HubDefinition;
export const selectHubStatus = createSelector(
    selectSignalrState,
    (state: BaseSignalRStoreState, { hubName, url }: SelectHubStatusProps) =>
        state.hubStatuses.filter(hs => hs.hubName === hubName && hs.url === url)[0],
);

export const selectAreAllHubsConnected = createSelector(
    selectHubsStatuses,
    (hubStatuses) => hubStatuses.every(hs => hs.state === 'connected')
);

type SelectHasHubStateProps = HubDefinition & { state: SignalRHubState };
export const selectHasHubState = createSelector(
    selectHubStatus,
    (state, props: SelectHasHubStateProps) => state.state === props.state
);