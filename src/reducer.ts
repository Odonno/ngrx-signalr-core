import { SignalRAction, SIGNALR_CREATE_HUB, SIGNALR_HUB_UNSTARTED, SIGNALR_CONNECTED, SIGNALR_DISCONNECTED } from "./actions";
import { SignalRHubStatus, SignalRHubState } from "./hubStatus";

const initialState = {
    hubStatuses: []
};

export interface BaseSignalRStoreState {
    hubStatuses: SignalRHubStatus[];
}

export function signalrReducer(
    state: BaseSignalRStoreState = initialState,
    action: SignalRAction
): BaseSignalRStoreState {
    switch (action.type) {
        case SIGNALR_CREATE_HUB:
            const newHubStatus = {
                hubName: action.hubName,
                url: action.url,
                state: undefined
            };

            return {
                ...state,
                hubStatuses: state.hubStatuses.concat([newHubStatus])
            };
        case SIGNALR_HUB_UNSTARTED:
            return {
                ...state,
                hubStatuses: state.hubStatuses.map(hs => {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return {
                            ...hs,
                            state: 'unstarted' as SignalRHubState
                        };
                    }
                    return hs;
                })
            };
        case SIGNALR_CONNECTED:
            return {
                ...state,
                hubStatuses: state.hubStatuses.map(hs => {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return {
                            ...hs,
                            state: 'connected' as SignalRHubState
                        };
                    }
                    return hs;
                })
            };
        case SIGNALR_DISCONNECTED:
            return {
                ...state,
                hubStatuses: state.hubStatuses.map(hs => {
                    if (hs.hubName === action.hubName && hs.url === action.url) {
                        return {
                            ...hs,
                            state: 'disconnected' as SignalRHubState
                        };
                    }
                    return hs;
                })
            };
        default:
            return state;
    }
}