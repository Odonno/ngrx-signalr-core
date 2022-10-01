import {
  IHttpConnectionOptions,
  HubConnectionBuilder,
  IRetryPolicy,
} from "@microsoft/signalr";

export const createConnection = (
  url: string,
  options?: IHttpConnectionOptions | undefined,
  automaticReconnect?: boolean | number[] | IRetryPolicy | undefined
) => {
  const builder = new HubConnectionBuilder();

  if (options) {
    builder.withUrl(url, options);
  } else {
    builder.withUrl(url);
  }

  if (automaticReconnect === true) {
    builder.withAutomaticReconnect();
  }

  if (automaticReconnect instanceof Array) {
    builder.withAutomaticReconnect(automaticReconnect);
  }

  if (
    typeof automaticReconnect === "object" &&
    "nextRetryDelayInMilliseconds" in automaticReconnect
  ) {
    builder.withAutomaticReconnect(automaticReconnect);
  }

  return builder.build();
};
