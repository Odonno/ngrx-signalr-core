import { MonoTypeOperatorFunction, Observable, of, fromEvent, merge } from "rxjs";
import { filter, map, mergeMap, exhaustMap, switchMap, startWith } from "rxjs/operators";
import { Action } from "@ngrx/store";
import { findHub } from "./hub";
import { hubNotFound } from "./actions";
import { HubAction, HubKeyDefinition } from "./models";
import { ISignalRHub } from "./SignalRHub.interface";

/**
 * Returns an Observable with the current status of network connection, whether online or offline.
 */
export const isOnline = () => {
    const offline$ = fromEvent(window, 'offline').pipe(
        map(() => false)
    );
    const online$ = fromEvent(window, 'online').pipe(
        map(() => true)
    );

    return merge(offline$, online$).pipe(
        startWith(navigator.onLine)
    );
}

/**
 * Filter a hub action based on the identifier of a SignalR hub (name, url).
 * @param hubName Name of the hub.
 * @param url Url of the hub.
 */
export function ofHub(hubName: string, url: string): MonoTypeOperatorFunction<HubAction>;
/**
 * Filter a hub action based on the identifier of a SignalR hub (name, url).
 * @param param0 Object that contains information to indentify a hub (name, url).
 */
export function ofHub({ hubName, url }: HubKeyDefinition): MonoTypeOperatorFunction<HubAction>;
export function ofHub(x: string | HubKeyDefinition, url?: string | undefined): MonoTypeOperatorFunction<HubAction> {
    if (typeof x === 'string') {
        return filter(action => action.hubName === x && action.url === url);
    } else {
        return filter(action => action.hubName === x.hubName && action.url === x.url);
    }
}

/**
 * Map the hub definition (hub name, url) to an existing SignalR hub instance.
 */
export const mapToHub = () => map(findHub);

type ObservableMapHubToActionInput<T extends Action> = {
    action: T;
    hub: ISignalRHub;
};
type ObservableMapHubToActionFunc<T extends Action, U> =
    (input: ObservableMapHubToActionInput<T>) => Observable<U>;

const hubAndActionOrNotFound =
    <T extends Action, U>(func: ObservableMapHubToActionFunc<T, U>) =>
        (action: T) => {
            const search = <HubAction><unknown>action;

            const hub = findHub(search);
            if (!hub) {
                return of(hubNotFound(search));
            }

            return func({ action, hub });
        };

/**
 * Map a hub action to a new object that contains 
 * both the original action and the SignalR hub instance, 
 * using `mergeMap` rxjs operator.
 * @param func A function that returns an Observable according to the given action and SignalR hub instance.
 */
export const mergeMapHubToAction =
    <T extends Action, U>(func: ObservableMapHubToActionFunc<T, U>) =>
        mergeMap(hubAndActionOrNotFound(func));

/**
 * Map a hub action to a new object that contains 
 * both the original action and the SignalR hub instance, 
 * using `switchMap` rxjs operator.
 * @param func A function that returns an Observable according to the given action and SignalR hub instance.
 */
export const switchMapHubToAction =
    <T extends Action, U>(func: ObservableMapHubToActionFunc<T, U>) =>
        switchMap(hubAndActionOrNotFound(func));

/**
 * Map a hub action to a new object that contains 
 * both the original action and the SignalR hub instance, 
 * using `exhaustMap` rxjs operator.
 * @param func A function that returns an Observable according to the given action and SignalR hub instance.
 */
export const exhaustMapHubToAction =
    <T extends Action, U>(func: ObservableMapHubToActionFunc<T, U>) =>
        exhaustMap(hubAndActionOrNotFound(func));