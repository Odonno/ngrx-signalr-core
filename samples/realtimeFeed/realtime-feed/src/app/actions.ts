import { createAction, props, union } from '@ngrx/store';
import { Feed } from './models';

export const loadFeeds = createAction("load feeds");
export const feedsLoaded = createAction("feeds loaded", props<{ feeds: Feed[] }>());
export const feedCreated = createAction("feed created", props<{ feed: Feed }>());

export const appActions = union({
    loadFeeds,
    feedsLoaded,
    feedCreated
});