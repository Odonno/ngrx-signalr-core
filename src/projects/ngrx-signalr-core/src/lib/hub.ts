import { IHttpConnectionOptions } from "@microsoft/signalr";
import { testingEnabled, hubCreationFunc } from "./testing";
import { ISignalRHub } from "./SignalRHub.interface";
import { SignalRHub } from "./SignalRHub";

const hubs: ISignalRHub[] = [];

/**
 * Find an existing SignalR hub instance.
 * @param hubName Name of the hub.
 * @param url Url of the hub.
 */
export function findHub(hubName: string, url: string): ISignalRHub | undefined;
/**
 * Find an existing SignalR hub instance.
 * @param param0 Object that contains information to indentify a hub (name, url).
 */
export function findHub({
  hubName,
  url,
}: {
  hubName: string;
  url: string;
}): ISignalRHub | undefined;
export function findHub(
  x: string | { hubName: string; url: string },
  url?: string | undefined
): ISignalRHub | undefined {
  if (typeof x === "string") {
    return hubs.filter((h) => h.hubName === x && h.url === url)[0];
  }
  return hubs.filter((h) => h.hubName === x.hubName && h.url === x.url)[0];
}

/**
 * Create a new SignalR hub instance.
 * @param hubName Name of the hub.
 * @param url Url of the hub.
 * @param options Configuration of the hub.
 */
export const createHub = (
  hubName: string,
  url: string,
  options?: IHttpConnectionOptions | undefined
): ISignalRHub | undefined => {
  if (testingEnabled) {
    const hub = hubCreationFunc(hubName, url, options);
    if (hub) {
      hubs.push(hub);
      return hub;
    }
    return undefined;
  }

  const hub = new SignalRHub(hubName, url, options);
  hubs.push(hub);
  return hub;
};
