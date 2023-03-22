import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { of, merge, EMPTY, timer } from "rxjs";
import {
  map,
  mergeMap,
  catchError,
  switchMap,
  takeUntil,
  groupBy,
  filter,
} from "rxjs/operators";
import { createHub } from "./hub";
import {
  SignalRAction,
  createSignalRHub,
  signalrHubUnstarted,
  startSignalRHub,
  reconnectSignalRHub,
  signalrConnected,
  signalrDisconnected,
  signalrError,
  signalrHubFailedToStart,
  stopSignalRHub,
  signalrReconnecting,
} from "./actions";
import {
  ofHub,
  exhaustMapHubToAction,
  isOnline$,
  mergeMapHubToAction,
} from "./operators";
import { Action } from "@ngrx/store";
import { connected, disconnected, reconnecting } from "./hubStatus";
import { Observable } from "rxjs";
import { TypedAction } from "@ngrx/store/src/models";

@Injectable({
  providedIn: "root",
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
      map((action) => {
        const hub = createHub(
          action.hubName,
          action.url,
          action.options,
          action.automaticReconnect,
          action.withHubProtocol
        );

        if (!hub) {
          return signalrError({
            hubName: action.hubName,
            url: action.url,
            error: "Unable to create SignalR hub...",
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
          mergeMap((_) => EMPTY),
          catchError((error) =>
            of(
              signalrHubFailedToStart({
                hubName: action.hubName,
                url: action.url,
                error,
              })
            )
          )
        );

        const state$ = hub.state$.pipe(
          mergeMap((state) => {
            if (state === connected) {
              return of(
                signalrConnected({ hubName: action.hubName, url: action.url, connectionId: hub.connectionId })
              );
            }
            if (state === disconnected) {
              return of(
                signalrDisconnected({
                  hubName: action.hubName,
                  url: action.url,
                })
              );
            }
            if (state === reconnecting) {
              return of(
                signalrReconnecting({
                  hubName: action.hubName,
                  url: action.url,
                })
              );
            }
            return EMPTY;
          })
        );

        const error$ = hub.error$.pipe(
          map((error) =>
            signalrError({ hubName: action.hubName, url: action.url, error })
          )
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
          mergeMap((_) => EMPTY),
          catchError((error) =>
            of(signalrError({ hubName: hub.hubName, url: hub.url, error }))
          )
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
          mergeMap((_) => EMPTY),
          catchError((error) =>
            of(signalrError({ hubName: hub.hubName, url: hub.url, error }))
          )
        );
      })
    )
  );

  constructor(private actions$: Actions<SignalRAction>) {}
}

type SignalrDisconnectedAction = {
  hubName: string;
  url: string;
} & TypedAction<"@ngrx/signalr/disconnected">;

export type ReconnectEffectOptions = {
  /**
   * Hub name, used to filter the hub to apply the reconnection effect.
   * If not provided, the effect will be applied to every SignalR Hub.
   */
  hubName?: string;

  /**
   * Returns the Observable to use to trigger reconnection of the hub (when disconnected).
   * With this, you can customize the reconnection pattern based on your needs.
   * If not provided, the default implementation will be applied : "trigger reconnection every 10s, only when there is a network connection"
   * @param action Action dispatched when a hub was disconnected.
   */
  reconnectionPolicy?: (action: SignalrDisconnectedAction) => Observable<any>;
};

const TEN_SECONDS = 10 * 1000;

/**
 * @deprecated Use `automaticReconnect` option when creating the SignalR hub.
 * Create an @ngrx effect to handle SignalR reconnection automatically.
 * @param actions$ Observable of all actions dispatched in the current app.
 * @param options Options to configure the effect.
 */
export const createReconnectEffect = (
  actions$: Actions<Action>,
  options?: ReconnectEffectOptions
) => {
  const defaultReconnect$ = timer(0, TEN_SECONDS).pipe(
    switchMap(isOnline$),
    filter((isOnline) => isOnline)
  );

  return createEffect(() =>
    actions$.pipe(
      ofType(signalrDisconnected),
      filter(
        (action) =>
          !options || !options.hubName || action.hubName === options.hubName
      ),
      groupBy((action) => action.hubName),
      mergeMap((group) =>
        group.pipe(
          exhaustMapHubToAction(({ action }) => {
            const reconnect$ =
              options && options.reconnectionPolicy
                ? options.reconnectionPolicy(action)
                : defaultReconnect$;

            return reconnect$.pipe(
              map((_) => reconnectSignalRHub(action)),
              takeUntil(actions$.pipe(ofType(signalrConnected), ofHub(action)))
            );
          }),
          takeUntil(
            actions$.pipe(
              ofType(stopSignalRHub),
              filter((action) => action.hubName === group.key)
            )
          )
        )
      )
    )
  );
};
