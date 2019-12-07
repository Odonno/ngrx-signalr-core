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
export class SignalREffects {
    // handle hub creation (then hub unstarted by default)
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

    // listen to start result (success/fail)
    // listen to change connection state (connected, disconnected)
    // listen to hub error
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

    // start hub
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

    // stop hub
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