import { Actions } from "@ngrx/effects";
import { MonoTypeOperatorFunction } from "rxjs";
import { Action } from "@ngrx/store";
import { SignalRAction } from "./actions";
interface HubAction extends Action {
    hubName: string;
    url: string;
}
export declare function ofHub(hubName: string, url: string): MonoTypeOperatorFunction<HubAction>;
export declare function ofHub({ hubName, url }: {
    hubName: string;
    url: string;
}): MonoTypeOperatorFunction<HubAction>;
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
export {};
