import { feedsAdapter } from './feeds.entities';
import { RootState } from './state';

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = feedsAdapter.getSelectors((state: RootState) => state.app.feeds);

export const selectFeedsIds = selectIds;
export const selectFeedsEntities = selectEntities;
export const selectFeeds = selectAll;
export const selectFeedsTotal = selectTotal;