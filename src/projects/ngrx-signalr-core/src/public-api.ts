/*
 * Public API Surface of ngrx-signalr-core
 */

export {
  SignalRAction,
  createSignalRHub,
  signalrHubUnstarted,
  startSignalRHub,
  stopSignalRHub,
  reconnectSignalRHub,
  signalrHubFailedToStart,
  signalrConnected,
  signalrReconnecting,
  signalrDisconnected,
  signalrError,
  hubNotFound,
} from "./lib/actions";
export { SignalREffects, createReconnectEffect } from "./lib/effects";
export { createHub, findHub } from "./lib/hub";
export { ISignalRHub } from "./lib/SignalRHub.interface";
export { SignalRHub } from "./lib/SignalRHub";
export { SignalRTestingHub } from "./lib/SignalRHub.testing";
export {
  SignalRStates,
  SignalRHubState,
  SignalRHubStatus,
} from "./lib/hubStatus";
export { HubAction, HubKeyDefinition, HubFullDefinition } from "./lib/models";
export {
  ofHub,
  mapToHub,
  exhaustMapHubToAction,
  mergeMapHubToAction,
  switchMapHubToAction,
} from "./lib/operators";
export { BaseSignalRStoreState, signalrReducer } from "./lib/reducer";
export {
  selectSignalrState,
  selectHubsStatuses,
  selectHubStatus,
  selectAreAllHubsConnected,
  selectHasHubState,
} from "./lib/selectors";
export { StoreSignalRService } from "./lib/storeSignalrService";
export { testingEnabled, enableTesting } from "./lib/testing";
