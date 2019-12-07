import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, merge, EMPTY, timer } from "rxjs";
import { map, mergeMap, catchError, tap, switchMap, takeUntil, groupBy } from 'rxjs/operators';

import { findHub, createHub } from "./hub";
import { SignalRAction, createSignalRHub, signalrHubUnstarted, startSignalRHub, reconnectSignalRHub, signalrConnected, signalrDisconnected, signalrError, signalrHubFailedToStart, stopSignalRHub } from "./actions";
import { ofHub, exhaustMapHubToAction, isOnline } from "./operators";
import { Action } from "@ngrx/store";
import { connected, disconnected } from "./hubStatus";

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
                if (!hub) {
                    return EMPTY;
                }

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
                const hub = findHub(action);

                if (!hub) {
                    return EMPTY;
                }

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

    // stop hub
    stopHub$ = createEffect(() =>
        this.actions$.pipe(
            ofType(stopSignalRHub),
            tap(action => {
                const hub = findHub(action);
                if (hub) {
                    hub.stop();
                }
            })
        ),
        { dispatch: false }
    );

    constructor(private actions$: Actions<SignalRAction>) { }
}

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