import { Feed } from './models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { sortByCreatedAtDesc } from './feeds.functions';

export interface FeedEntityState extends EntityState<Feed> {
    canLoadMore: boolean;
}

export const feedsAdapter = createEntityAdapter<Feed>( {
    sortComparer: sortByCreatedAtDesc
});

export const feedsInitialState: FeedEntityState = feedsAdapter.getInitialState({
    canLoadMore: false
});