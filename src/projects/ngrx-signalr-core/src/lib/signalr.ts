import { Subject } from "rxjs";
import {
  IHttpConnectionOptions,
  HubConnectionBuilder,
} from "@microsoft/signalr";

export const getOrCreateSubject = <T>(
  subjects: { [name: string]: Subject<any> },
  event: string
): Subject<T> => {
  return subjects[event] || (subjects[event] = new Subject<T>());
};

export const createConnection = (
  url: string,
  options?: IHttpConnectionOptions | undefined
) => {
  if (!options) {
    return new HubConnectionBuilder().withUrl(url).build();
  }

  return new HubConnectionBuilder().withUrl(url, options).build();
};
