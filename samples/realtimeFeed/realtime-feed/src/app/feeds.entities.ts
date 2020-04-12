import { Feed } from './models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

const sortByCreatedAtDesc = (a: Feed, b: Feed) => {
    return a.createdAt > b.createdAt ? -1 : 1;
}

export interface FeedEntityState extends EntityState<Feed> {
}

export const feedsAdapter = createEntityAdapter<Feed>({
    sortComparer: sortByCreatedAtDesc
});

export const feedsInitialState: FeedEntityState = feedsAdapter.getInitialState();