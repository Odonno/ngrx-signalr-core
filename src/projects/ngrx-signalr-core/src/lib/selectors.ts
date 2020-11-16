import { BaseSignalRStoreState } from "./reducer";
import { DEFAULT_SIGNALR_FEATURENAME } from "./constants";
import { createSelector } from "@ngrx/store";
import { SignalRHubState, connected } from "./hubStatus";
import { HubKeyDefinition } from "./models";

interface RootState {
  signalr: BaseSignalRStoreState;
}

/**
 * Feature selector to the select the part of the state about SignalR.
 * @param state Root state.
 */
export const selectSignalrState = (state: RootState) =>
  state[DEFAULT_SIGNALR_FEATURENAME];

/**
 * Select all hub statuses.
 */
export const selectHubsStatuses = createSelector(
  selectSignalrState,
  (state) => state.hubStatuses
);

type SelectHubStatusProps = HubKeyDefinition;
/**
 * Select a single hub status.
 */
export const selectHubStatus = createSelector(
  selectSignalrState,
  (state: BaseSignalRStoreState, { hubName, url }: SelectHubStatusProps) =>
    state.hubStatuses.filter(
      (hs) => hs.hubName === hubName && hs.url === url
    )[0]
);

/**
 * Select a value (true or false) when all hubs are connected.
 */
export const selectAreAllHubsConnected = createSelector(
  selectHubsStatuses,
  (hubStatuses) => hubStatuses.every((hs) => hs.state === connected)
);

type SelectHasHubStateProps = HubKeyDefinition & { state: SignalRHubState };
/**
 * Select a value (true or false) when a single hub have a given status (unstarted, connected, disconnected).
 */
export const selectHasHubState = createSelector(
  selectHubStatus,
  (state, props: SelectHasHubStateProps) =>
    !!state && state.state === props.state
);
