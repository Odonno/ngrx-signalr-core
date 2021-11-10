import { BaseSignalRStoreState } from "./reducer";
import { DEFAULT_SIGNALR_FEATURENAME } from "./constants";
import { createSelector } from "@ngrx/store";
import { SignalRHubState, connected, SignalRHubStatus } from "./hubStatus";

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
  (state: BaseSignalRStoreState) => state.hubStatuses
);

/**
 * Select a single hub status.
 */
export const selectHubStatus = (hubName: string, url: string) =>
  createSelector(
    selectSignalrState,
    (state: BaseSignalRStoreState) =>
      state.hubStatuses.filter(
        (hs) => hs.hubName === hubName && hs.url === url
      )[0]
  );

/**
 * Select a value (true or false) when all hubs are connected.
 */
export const selectAreAllHubsConnected = createSelector(
  selectHubsStatuses,
  (hubStatuses: SignalRHubStatus[]) =>
    hubStatuses.every((hs) => hs.state === connected)
);

/**
 * Select a value (true or false) when a single hub have a given status (unstarted, connected, disconnected).
 */
export const selectHasHubState = (
  hubName: string,
  url: string,
  hubState: SignalRHubState
) =>
  createSelector(
    selectHubStatus(hubName, url),
    (state: SignalRHubStatus) => !!state && state.state === hubState
  );
