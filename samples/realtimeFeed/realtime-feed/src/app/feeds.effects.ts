import { createEffect, Actions, ofType } from '@ngrx/effects';
import { SIGNALR_HUB_UNSTARTED, mergeMapHubToAction, startSignalRHub, ofHub, findHub, hubNotFound, createReconnectEffect, SIGNALR_CONNECTED } from 'ngrx-signalr-core';
import { merge, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { feedsLoaded, feedCreated, loadFeeds } from './actions';
import { feedHub } from './hubs';
import { Feed } from './models';
import { Injectable } from '@angular/core';

@Injectable()
export class FeedsEffects {
    constructor(private readonly actions$: Actions) {
    }

    whenDisconnected$ = createReconnectEffect(this.actions$, 10 * 1000);

    initRealtime$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SIGNALR_HUB_UNSTARTED),
            ofHub(feedHub),
            mergeMapHubToAction(({ hub }) => {
                const whenFeedsLoaded$ = hub.on<Feed[]>('feedsLoaded').pipe(
                    map(feeds => feedsLoaded({ feeds }))
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
}