import { Actions } from "@ngrx/effects";
import { MonoTypeOperatorFunction } from "rxjs";
import { SignalRStartHubAction, SignalRReconnectHubAction } from "./actions";
import { Action } from "@ngrx/store";
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
        type: string;
        hubName: string;
        url: string;
    }>;
    beforeStartHub$: import("rxjs").Observable<{
        type: string;
        hubName: string;
        url: string;
        error: any;
    } | {
        type: string;
        hubName: string;
        url: string;
    } | {
        type: string;
        hubName: string;
        url: string;
        error: Error | undefined;
    } | undefined>;
    startHub$: import("rxjs").Observable<SignalRStartHubAction | SignalRReconnectHubAction>;
    constructor(actions$: Actions);
}
export {};
