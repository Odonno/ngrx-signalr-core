import { Feed } from './models'
import { createReducer, Action, on } from '@ngrx/store';
import { feedsLoaded, feedCreated } from './actions';

export type RootState = {
    app: AppState;
};

export type AppState = {
    feeds: Feed[] // TODO : use @ngrx/entity
};

export const initialState: AppState = {
    feeds: []
};

const appReducer = createReducer(
    initialState,
    on(feedsLoaded, (state: AppState, { feeds }) => ({
        ...state,
        feeds // TODO : use @ngrx/entity
    })),
    on(feedCreated, (state: AppState, { feed }) => ({
        ...state,
        feeds: state.feeds.concat(feed) // TODO : use @ngrx/entity
    }))
);

export function reducer(state: AppState | undefined, action: Action) {
    return appReducer(state, action);
}