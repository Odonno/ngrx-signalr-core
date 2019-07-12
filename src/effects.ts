import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, merge, EMPTY, fromEvent, interval } from "rxjs";
import { map, mergeMap, catchError, tap, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { findHub, createHub } from "./hub";
import { SignalRAction, createSignalRHub, signalrHubUnstarted, startSignalRHub, reconnectSignalRHub, signalrConnected, signalrDisconnected, signalrError, signalrHubFailedToStart, SIGNALR_DISCONNECTED, hubNotFound, SIGNALR_CONNECTED } from "./actions";

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

const offline$ = fromEvent(window, 'offline').pipe(
    map(() => false)
);
const online$ = fromEvent(window, 'online').pipe(
    map(() => true)
);

const isOnline = () => merge(offline$, online$).pipe(
    startWith(navigator.onLine)
);

export const createReconnectEffect = (actions$: Actions<SignalRAction>, intervalTimespan: number) => {
    return createEffect(() =>
        actions$.pipe(
            ofType(SIGNALR_DISCONNECTED),
            switchMap(action => {
                const hub = findHub(action);

                if (!hub) {
                    return of(hubNotFound(action));
                }

                return isOnline().pipe(
                    switchMap(online => {
                        if (!online) {
                            return EMPTY;
                        }

                        return interval(intervalTimespan).pipe(
                            map(_ => reconnectSignalRHub(action)),
                            takeUntil(actions$.pipe(ofType(SIGNALR_CONNECTED)))
                        );
                    })
                );
            })
        )
    );
};