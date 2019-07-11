import { Actions } from "@ngrx/effects";
import { SignalRAction } from "./actions";
export declare class SignalREffects {
    private actions$;
    createHub$: import("rxjs").Observable<{
        hubName: string;
        url: string;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubUnstarted">>;
    beforeStartHub$: import("rxjs").Observable<({
        hubName: string;
        url: string;
        error: any;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubFailedToStart">) | ({
        hubName: string;
        url: string;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/connected">) | ({
        hubName: string;
        url: string;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/disconnected">) | ({
        hubName: string;
        url: string;
        error: any;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/error">)>;
    startHub$: import("rxjs").Observable<({
        hubName: string;
        url: string;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/startHub">) | ({
        hubName: string;
        url: string;
    } & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/reconnectHub">)>;
    constructor(actions$: Actions<SignalRAction>);
}
