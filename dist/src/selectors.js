import { DEFAULT_SIGNALR_FEATURENAME } from "./constants";
import { createSelector } from "@ngrx/store";
export const selectSignalrState = (state) => state[DEFAULT_SIGNALR_FEATURENAME];
export const selectHubsStatuses = createSelector(selectSignalrState, state => state.hubStatuses);
export const selectHubStatus = createSelector(selectSignalrState, (state, { hubName, url }) => state.hubStatuses.filter(hs => hs.hubName === hubName && hs.url === url)[0]);
export const selectAreAllHubsConnected = createSelector(selectHubsStatuses, (hubStatuses) => hubStatuses.every(hs => hs.state === 'connected'));
