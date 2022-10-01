import { createEffect, Actions, ofType } from "@ngrx/effects";
import {
  mergeMapHubToAction,
  startSignalRHub,
  ofHub,
  findHub,
  hubNotFound,
  signalrHubUnstarted,
  signalrConnected,
} from "ngrx-signalr-core";
import { merge, of } from "rxjs";
import { map, mergeMap, withLatestFrom } from "rxjs/operators";
import {
  feedsLoaded,
  feedCreated,
  loadFeeds,
  loadMoreFeeds,
} from "./feeds.actions";
import { feedHub } from "./hubs";
import { Feed, LoadFeedsResponse } from "./models";
import { Injectable } from "@angular/core";
import { RootState } from "./state";
import { Store } from "@ngrx/store";
import { selectOldestFeed } from "./feeds.selectors";

@Injectable()
export class FeedsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<RootState>
  ) {}

  initRealtime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signalrHubUnstarted),
      ofHub(feedHub),
      map((hub) => startSignalRHub(hub))
    )
  );

  listenFeedEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signalrConnected),
      ofHub(feedHub),
      mergeMapHubToAction(({ hub }) => {
        const whenFeedsLoaded$ = hub
          .on<LoadFeedsResponse>("feedsLoaded")
          .pipe(
            map(({ feeds, canLoadMore }) => feedsLoaded({ feeds, canLoadMore }))
          );
        const whenFeedCreated$ = hub
          .on<Feed>("feedCreated")
          .pipe(map((feed) => feedCreated({ feed })));

        const loadFeedsOnStart$ = of(loadFeeds());

        return merge(whenFeedsLoaded$, whenFeedCreated$, loadFeedsOnStart$);
      })
    )
  );

  loadFeeds$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadFeeds),
        mergeMap((_) => {
          const hub = findHub(feedHub);
          if (!hub) {
            return of(hubNotFound(feedHub));
          }

          return hub.send("loadFeeds");
        })
      ),
    { dispatch: false }
  );

  loadMoreFeeds$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadMoreFeeds),
        withLatestFrom(this.store.select(selectOldestFeed)),
        mergeMap(([_, oldestFeed]) => {
          const hub = findHub(feedHub);
          if (!hub) {
            return of(hubNotFound(feedHub));
          }

          return hub.send("loadMoreFeeds", oldestFeed.createdAt);
        })
      ),
    { dispatch: false }
  );
}
