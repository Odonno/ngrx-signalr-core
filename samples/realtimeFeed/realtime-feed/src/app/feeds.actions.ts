import { createAction, props, union } from '@ngrx/store';
import { Feed } from './models';

export const loadFeeds = createAction("load feeds");
export const feedsLoaded = createAction("feeds loaded", props<{ feeds: Feed[], canLoadMore: boolean }>());
export const feedCreated = createAction("feed created", props<{ feed: Feed }>());
export const loadMoreFeeds = createAction("load more feeds");

export const feedsActions = union({
    loadFeeds,
    feedsLoaded,
    feedCreated,
    loadMoreFeeds
});