import { RootState } from './state';

export const selectFeeds = (state: RootState) => state.app.feeds; // TODO : use @ngrx/entity