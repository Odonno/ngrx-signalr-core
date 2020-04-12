import { createEffect, Actions, ofType } from '@ngrx/effects';
import { SIGNALR_HUB_UNSTARTED, mergeMapHubToAction, startSignalRHub, ofHub, findHub, hubNotFound, createReconnectEffect, SIGNALR_CONNECTED } from 'ngrx-signalr-core';
import { merge, of } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { feedsLoaded, feedCreated, loadFeeds, loadMoreFeeds } from './feeds.actions';
import { feedHub } from './hubs';
import { Feed, LoadFeedsResponse } from './models';
import { Injectable } from '@angular/core';
import { RootState } from './state';
import { Store } from '@ngrx/store';
import { selectOldestFeed } from './feeds.selectors';

@Injectable()
export class FeedsEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<RootState>
    ) {
    }

    whenDisconnected$ = createReconnectEffect(this.actions$, 10 * 1000);

    initRealtime$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SIGNALR_HUB_UNSTARTED),
            ofHub(feedHub),
            mergeMapHubToAction(({ hub }) => {
                const whenFeedsLoaded$ = hub.on<LoadFeedsResponse>('feedsLoaded').pipe(
                    map(({ feeds, canLoadMore }) => feedsLoaded({ feeds, canLoadMore }))
                );
                const whenFeedCreated$ = hub.on<Feed>('feedCreated').pipe(
                    map(feed => feedCreated({ feed }))
                );

                return merge(
                    whenFeedsLoaded$,
                    whenFeedCreated$,
                    of(startSignalRHub(hub))
                );
            })
        )
    );

    whenFeedHubStarted$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SIGNALR_CONNECTED),
            ofHub(feedHub),
            map(_ => loadFeeds())
        )
    );

    loadFeeds$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadFeeds),
            mergeMap(_ => {
                const hub = findHub(feedHub);
                if (!hub) {
                    return of(hubNotFound(feedHub));
                }

                return hub.send('loadFeeds');
            })
        ),
        { dispatch: false }
    );

    loadMoreFeeds$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadMoreFeeds),
            withLatestFrom(
                this.store.select(selectOldestFeed)
            ),
            mergeMap(([_, oldestFeed]) => {
                const hub = findHub(feedHub);
                if (!hub) {
                    return of(hubNotFound(feedHub));
                }

                return hub.send('loadMoreFeeds', oldestFeed.createdAt);
            })
        ),
        { dispatch: false }
    );
}