import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, merge, empty, MonoTypeOperatorFunction } from "rxjs";
import { map, mergeMap, catchError, tap, filter } from 'rxjs/operators';

import { SIGNALR_HUB_UNSTARTED, SignalRHubUnstartedAction, SIGNALR_HUB_FAILED_TO_START, SIGNALR_ERROR, SIGNALR_CONNECTED, SIGNALR_DISCONNECTED, SIGNALR_CREATE_HUB, SignalRCreateHubAction, SignalRStartHubAction, SIGNALR_START_HUB, SignalRReconnectHubAction, SIGNALR_RECONNECT_HUB } from "./actions";
import { findHub, createHub } from "./hub";
import { Action } from "@ngrx/store";

interface HubAction extends Action {
    hubName: string;
    url: string;
}

export function ofHub(hubName: string, url: string): MonoTypeOperatorFunction<HubAction>;
export function ofHub({ hubName, url }: { hubName: string, url: string }): MonoTypeOperatorFunction<HubAction>;
export function ofHub(x: string | { hubName: string, url: string }, url?: string | undefined): MonoTypeOperatorFunction<HubAction> {
    if (typeof x === 'string') {
        return filter(action => action.hubName === x && action.url === url);
    } else {
        return filter(action => action.hubName === x.hubName && action.url === x.url);
    }
}

@Injectable({
    providedIn: 'root'
})
export class SignalREffects {
    // handle hub creation (then hub unstarted by default)
    @Effect()
    createHub$ = this.actions$.pipe(
        ofType<SignalRCreateHubAction>(SIGNALR_CREATE_HUB),
        mergeMap(action => {
            const hub = createHub(action.hubName, action.url, action.options);
            return of({ type: SIGNALR_HUB_UNSTARTED, hubName: hub.hubName, url: hub.url });
        })
    );

    // listen to start result (success/fail)
    // listen to change connection state (connected, disconnected)
    // listen to hub error
    @Effect()
    beforeStartHub$ = this.actions$.pipe(
        ofType<SignalRHubUnstartedAction>(SIGNALR_HUB_UNSTARTED),
        mergeMap(action => {
            const hub = findHub(action.hubName, action.url);

            if (!hub) {
                return empty();
            }

            const start$ = hub.start$.pipe(
                mergeMap(_ => empty()),
                catchError(error => of(({ type: SIGNALR_HUB_FAILED_TO_START, hubName: action.hubName, url: action.url, error })))
            );

            const state$ = hub.state$.pipe(
                map(state => {
                    if (state === 'connected') {
                        return { type: SIGNALR_CONNECTED, hubName: action.hubName, url: action.url };
                    }
                    if (state === 'disconnected') {
                        return { type: SIGNALR_DISCONNECTED, hubName: action.hubName, url: action.url };
                    }
                })
            );

            const error$ = hub.error$.pipe(
                map(error => ({ type: SIGNALR_ERROR, hubName: action.hubName, url: action.url, error }))
            );

            return merge(start$, state$, error$);
        })
    );

    // start hub
    @Effect({ dispatch: false })
    startHub$ = this.actions$.pipe(
        ofType<SignalRStartHubAction | SignalRReconnectHubAction>(SIGNALR_START_HUB, SIGNALR_RECONNECT_HUB),
        tap(action => {
            const hub = findHub(action);
            if (hub) {
                hub.start();
            }
        })
    );

    constructor(private actions$: Actions) { }
}