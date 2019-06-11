import { createReducer, on } from "@ngrx/store";
import { createSignalRHub, signalrHubUnstarted, signalrConnected, signalrDisconnected } from "./actions";
const initialState = {
    hubStatuses: []
};
const reducer = createReducer(initialState, on(createSignalRHub, (state, action) => (Object.assign({}, state, { hubStatuses: state.hubStatuses.concat([{
            hubName: action.hubName,
            url: action.url,
            state: undefined
        }]) }))), on(signalrHubUnstarted, (state, action) => {
    return Object.assign({}, state, { hubStatuses: state.hubStatuses.map(hs => {
            if (hs.hubName === action.hubName && hs.url === action.url) {
                return Object.assign({}, hs, { state: 'unstarted' });
            }
            return hs;
        }) });
}), on(signalrConnected, (state, action) => {
    return Object.assign({}, state, { hubStatuses: state.hubStatuses.map(hs => {
            if (hs.hubName === action.hubName && hs.url === action.url) {
                return Object.assign({}, hs, { state: 'connected' });
            }
            return hs;
        }) });
}), on(signalrDisconnected, (state, action) => {
    return Object.assign({}, state, { hubStatuses: state.hubStatuses.map(hs => {
            if (hs.hubName === action.hubName && hs.url === action.url) {
                return Object.assign({}, hs, { state: 'disconnected' });
            }
            return hs;
        }) });
}));
export function signalrReducer(state, action) {
    return reducer(state, action);
}
;
