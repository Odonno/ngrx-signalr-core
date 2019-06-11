import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, merge, MonoTypeOperatorFunction, EMPTY } from "rxjs";
import { map, mergeMap, catchError, tap, filter } from 'rxjs/operators';

import { findHub, createHub } from "./hub";
import { Action } from "@ngrx/store";
import { SignalRAction, createSignalRHub, signalrHubUnstarted, startSignalRHub, reconnectSignalRHub, signalrConnected, signalrDisconnected, signalrError, signalrHubFailedToStart } from "./actions";

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
    createHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createSignalRHub),
            mergeMap(action => {
                const hub = createHub(action.hubName, action.url, action.options);
                return of(signalrHubUnstarted({ hubName: hub.hubName, url: hub.url }));
            })
        )
    );

    // listen to start result (success/fail)
    // listen to change connection state (connected, disconnected)
    // listen to hub error
    beforeStartHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(signalrHubUnstarted),
            mergeMap(action => {
                const hub = findHub(action.hubName, action.url);

                if (!hub) {
                    return EMPTY;
                }

                const start$ = hub.start$.pipe(
                    mergeMap(_ => EMPTY),
                    catchError(error => of(signalrHubFailedToStart({ hubName: action.hubName, url: action.url, error })))
                );

                const state$ = hub.state$.pipe(
                    mergeMap(state => {
                        if (state === 'connected') {
                            return of(signalrConnected({ hubName: action.hubName, url: action.url }));
                        }
                        if (state === 'disconnected') {
                            return of(signalrDisconnected({ hubName: action.hubName, url: action.url }));
                        }
                        return EMPTY;
                    })
                );

                const error$ = hub.error$.pipe(
                    map(error => signalrError({ hubName: action.hubName, url: action.url, error }))
                );

                return merge(start$, state$, error$);
            })
        )
    );

    // start hub
    startHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(startSignalRHub, reconnectSignalRHub),
            tap(action => {
                const hub = findHub(action);
                if (hub) {
                    hub.start();
                }
            })
        ),
        { dispatch: false }
    );

    constructor(private actions$: Actions<SignalRAction>) { }
}