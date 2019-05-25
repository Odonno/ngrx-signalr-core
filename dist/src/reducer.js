import { SIGNALR_CREATE_HUB, SIGNALR_HUB_UNSTARTED, SIGNALR_CONNECTED, SIGNALR_DISCONNECTED } from "./actions";
const initialState = {
    hubStatuses: []
};
export function signalrReducer(state = initialState, action) {
    switch (action.type) {
        case SIGNALR_CREATE_HUB:
            const newHubStatus = {
                hubName: action.hubName,
                url: action.url,
                state: undefined
            };
            return Object.assign({}, state, { hubStatuses: state.hubStatuses.concat([newHubStatus]) });
        case SIGNALR_HUB_UNSTARTED:
            return Object.assign({}, state, { hubStatuses: state.hubStatuses.map(hs => {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return Object.assign({}, hs, { state: 'unstarted' });
                    }
                    return hs;
                }) });
        case SIGNALR_CONNECTED:
            return Object.assign({}, state, { hubStatuses: state.hubStatuses.map(hs => {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return Object.assign({}, hs, { state: 'connected' });
                    }
                    return hs;
                }) });
        case SIGNALR_DISCONNECTED:
            return Object.assign({}, state, { hubStatuses: state.hubStatuses.map(hs => {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return Object.assign({}, hs, { state: 'disconnected' });
                    }
                    return hs;
                }) });
        default:
            return state;
    }
}
