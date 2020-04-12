import { feedsAdapter } from './feeds.entities';
import { RootState } from './state';
import { createSelector } from '@ngrx/store';
import { sortByCreatedAtAsc } from './feeds.functions';

const selectFeedsEntityState = (state: RootState) => state.app.feeds;

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = feedsAdapter.getSelectors(selectFeedsEntityState);

export const selectFeedsIds = selectIds;
export const selectFeedsEntities = selectEntities;
export const selectFeeds = selectAll;
export const selectFeedsTotal = selectTotal;

export const selectOldestFeed = createSelector(
    selectFeeds,
    feeds => feeds.sort(sortByCreatedAtAsc)[0]
)

export const selectCanLoadMore = createSelector(
    selectFeedsEntityState,
    state => state.canLoadMore
);