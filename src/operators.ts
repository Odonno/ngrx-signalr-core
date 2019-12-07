import { MonoTypeOperatorFunction, Observable, of, fromEvent, merge } from "rxjs";
import { filter, map, mergeMap, exhaustMap, switchMap, startWith } from "rxjs/operators";
import { Action } from "@ngrx/store";
import { findHub } from "./hub";
import { hubNotFound } from "./actions";
import { HubAction, HubKeyDefinition } from "./models";
import { ISignalRHub } from "./SignalRHub.interface";

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

export function ofHub(hubName: string, url: string): MonoTypeOperatorFunction<HubAction>;
export function ofHub({ hubName, url }: HubKeyDefinition): MonoTypeOperatorFunction<HubAction>;
export function ofHub(x: string | HubKeyDefinition, url?: string | undefined): MonoTypeOperatorFunction<HubAction> {
    if (typeof x === 'string') {
        return filter(action => action.hubName === x && action.url === url);
    } else {
        return filter(action => action.hubName === x.hubName && action.url === x.url);
    }
}

export const mapToHub = () => map(findHub);

type ObservableMapHubToActionInput = {
    action: HubAction;
    hub: ISignalRHub;
};
type ObservableMapHubToActionFunc<T extends Action> =
    (input: ObservableMapHubToActionInput) => Observable<T>;

const hubAndActionOrNotFound =
    <T extends Action>(func: ObservableMapHubToActionFunc<T>) =>
        (action: HubAction) => {
            const hub = findHub(action);
            if (!hub) {
                return of(hubNotFound(action));
            }

            return func({ action, hub });
        };

export const mergeMapHubToAction =
    <T extends Action>(func: ObservableMapHubToActionFunc<T>) =>
        mergeMap(hubAndActionOrNotFound(func));

export const switchMapHubToAction =
    <T extends Action>(func: ObservableMapHubToActionFunc<T>) =>
        switchMap(hubAndActionOrNotFound(func));

export const exhaustMapHubToAction =
    <T extends Action>(func: ObservableMapHubToActionFunc<T>) =>
        exhaustMap(hubAndActionOrNotFound(func));