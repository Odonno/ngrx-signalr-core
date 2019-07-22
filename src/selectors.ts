import { BaseSignalRStoreState } from "./reducer";
import { DEFAULT_SIGNALR_FEATURENAME } from "./constants";
import { createSelector } from "@ngrx/store";
import { SignalRHubState } from "./hubStatus";
import { HubKeyDefinition } from "./models";

interface RootState {
    signalr: BaseSignalRStoreState;
}

export const selectSignalrState = (state: RootState) => state[DEFAULT_SIGNALR_FEATURENAME];

export const selectHubsStatuses = createSelector(
    selectSignalrState,
    state => state.hubStatuses
);

type SelectHubStatusProps = HubKeyDefinition;
export const selectHubStatus = createSelector(
    selectSignalrState,
    (state: BaseSignalRStoreState, { hubName, url }: SelectHubStatusProps) =>
        state.hubStatuses.filter(hs => hs.hubName === hubName && hs.url === url)[0],
);

export const selectAreAllHubsConnected = createSelector(
    selectHubsStatuses,
    (hubStatuses) => hubStatuses.every(hs => hs.state === 'connected')
);

type SelectHasHubStateProps = HubKeyDefinition & { state: SignalRHubState };
export const selectHasHubState = createSelector(
    selectHubStatus,
    (state, props: SelectHasHubStateProps) => state.state === props.state
);