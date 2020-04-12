import { createReducer, Action, on } from '@ngrx/store';
import { feedsLoaded, feedCreated } from './actions';
import { FeedEntityState, feedsInitialState, feedsAdapter } from './feeds.entities';

export type RootState = {
    app: AppState;
};

export type AppState = {
    feeds: FeedEntityState
};

export const initialState: AppState = {
    feeds: feedsInitialState
};

const appReducer = createReducer(
    initialState,
    on(feedsLoaded, (state: AppState, { feeds }) => ({
        ...state,
        feeds: feedsAdapter.addAll(feeds, state.feeds)
    })),
    on(feedCreated, (state: AppState, { feed }) => ({
        ...state,
        feeds: feedsAdapter.addOne(feed, state.feeds)
    }))
);

export function reducer(state: AppState | undefined, action: Action) {
    return appReducer(state, action);
}