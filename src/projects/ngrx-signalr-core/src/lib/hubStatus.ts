import { HubConnectionState } from "@microsoft/signalr";
import { HubKeyDefinition } from "./models";

export const unstarted = "unstarted";
export const connected = "connected";
export const disconnected = "disconnected";
export const reconnecting = "reconnecting";
export const reconnected = "reconnected";

/**
 * List of given states a SignalR can be.
 */
export const SignalRStates = {
  unstarted,
  connected,
  disconnected,
  reconnecting,
  reconnected,
};

/**
 * Convert a hub connection state to the internal state value.
 * @param state The state of the hub connection.
 */
export const toSignalRState = (state: HubConnectionState) => {
  switch (state) {
    case HubConnectionState.Connected:
      return connected;
    case HubConnectionState.Disconnected:
      return disconnected;
    case HubConnectionState.Reconnecting:
      return reconnecting;
  }
};

/**
 * Connection state definition of a SignalR hub.
 */
export type SignalRHubState =
  | typeof unstarted
  | typeof connected
  | typeof disconnected
  | typeof reconnecting
  | typeof reconnected;

/**
 * Status definition of a SignalR hub.
 */
export type SignalRHubStatus = HubKeyDefinition & {
  state: SignalRHubState;
};
