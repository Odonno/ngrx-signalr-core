import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, merge, EMPTY, timer } from "rxjs";
import { map, mergeMap, catchError, switchMap, takeUntil, groupBy } from 'rxjs/operators';

import { createHub } from "./hub";
import { SignalRAction, createSignalRHub, signalrHubUnstarted, startSignalRHub, reconnectSignalRHub, signalrConnected, signalrDisconnected, signalrError, signalrHubFailedToStart, stopSignalRHub } from "./actions";
import { ofHub, exhaustMapHubToAction, isOnline, mergeMapHubToAction } from "./operators";
import { Action } from "@ngrx/store";
import { connected, disconnected } from "./hubStatus";

@Injectable({
    providedIn: 'root'
})
/**
 * Collection of effects to execute realtime events (hub creation, starting, stopping, etc..).
 */
export class SignalREffects {
    /**
     * Automatically create a new SignalR hub (then set hub state to `unstarted` by default).
     */
    createHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createSignalRHub),
            map(action => {
                const hub = createHub(action.hubName, action.url, action.options);
                if (!hub) {
                    return signalrError({
                        hubName: action.hubName,
                        url: action.url, 
                        error: 'Unable to create SignalR hub...'
                    });
                }

                return signalrHubUnstarted({ hubName: hub.hubName, url: hub.url });
            })
        )
    );

    /**
     * Listen to every change on the SignalR hub.
     * Listen to start result (success/fail).
     * Listen to change connection state (connected, disconnected).
     * Listen to hub error.
     */
    beforeStartHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(signalrHubUnstarted),
            mergeMapHubToAction(({ hub, action }) => {
                const start$ = hub.start$.pipe(
                    mergeMap(_ => EMPTY),
                    catchError(error => of(signalrHubFailedToStart({ hubName: action.hubName, url: action.url, error })))
                );

                const state$ = hub.state$.pipe(
                    mergeMap(state => {
                        if (state === connected) {
                            return of(signalrConnected({ hubName: action.hubName, url: action.url }));
                        }
                        if (state === disconnected) {
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

    /**
     * Automatically start hub based on actions dispatched.
     */
    startHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(startSignalRHub, reconnectSignalRHub),
            mergeMapHubToAction(({ hub }) => {
                return hub.start().pipe(
                    mergeMap(_ => EMPTY),
                    catchError(error => of(signalrError({ hubName: hub.hubName, url: hub.url, error })))
                );
            })
        )
    );

    /**
     * Automatically stop hub based on actions dispatched.
     */
    stopHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(stopSignalRHub),
            mergeMapHubToAction(({ hub }) => {
                return hub.stop().pipe(
                    mergeMap(_ => EMPTY),
                    catchError(error => of(signalrError({ hubName: hub.hubName, url: hub.url, error })))
                );
            })
        )
    );

    constructor(private actions$: Actions<SignalRAction>) { }
}

/**
 * Create an @ngrx effect to handle SignalR reconnection automatically.
 * @param actions$ Observable of all actions dispatched in the current app.
 * @param intervalTimespan Timespan between each reconnection attempt (in milliseconds).
 */
export const createReconnectEffect = (actions$: Actions<Action>, intervalTimespan: number) => {
    return createEffect(() =>
        actions$.pipe(
            ofType(signalrDisconnected),
            groupBy(action => action.hubName),
            mergeMap(group =>
                group.pipe(
                    exhaustMapHubToAction(({ action }) =>
                        isOnline().pipe(
                            switchMap(online => {
                                if (!online) {
                                    return EMPTY;
                                }
                                return timer(0, intervalTimespan);
                            }),
                            map(_ => reconnectSignalRHub(action)),
                            takeUntil(
                                actions$.pipe(
                                    ofType(signalrConnected),
                                    ofHub(action)
                                )
                            )
                        )
                    )
                )
            )
        )
    );
};