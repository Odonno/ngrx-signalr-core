import { SignalRHubStatus, SignalRHubState } from "./hubStatus";
import { createReducer, on, Action } from "@ngrx/store";
import { createSignalRHub, signalrHubUnstarted, signalrConnected, signalrDisconnected } from "./actions";

const initialState = {
    hubStatuses: []
};

export interface BaseSignalRStoreState {
    hubStatuses: SignalRHubStatus[];
}

const reducer = createReducer<BaseSignalRStoreState>(
    initialState,
    on(createSignalRHub, (state, action) => ({
        ...state,
        hubStatuses: state.hubStatuses.concat([{
            hubName: action.hubName,
            url: action.url,
            state: 'unstarted' as SignalRHubState
        }])
    })),
    on(signalrHubUnstarted, (state, action) => {
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
    }),
    on(signalrConnected, (state, action) => {
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
    }),
    on(signalrDisconnected, (state, action) => {
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
    })
);

export function signalrReducer(state: BaseSignalRStoreState | undefined, action: Action) {
    return reducer(state, action);
};
