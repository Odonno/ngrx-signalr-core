import {
  IHttpConnectionOptions,
  HubConnectionBuilder,
} from "@microsoft/signalr";

export const createConnection = (
  url: string,
  options?: IHttpConnectionOptions | undefined
) => {
  if (!options) {
    return new HubConnectionBuilder().withUrl(url).build();
  }

  return new HubConnectionBuilder().withUrl(url, options).build();
};
