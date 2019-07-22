import { MonoTypeOperatorFunction, Observable } from "rxjs";
import { Action } from "@ngrx/store";
import { ISignalRHub } from "./hub";
import { HubAction, HubKeyDefinition } from "./models";
export declare function ofHub(hubName: string, url: string): MonoTypeOperatorFunction<HubAction>;
export declare function ofHub({ hubName, url }: HubKeyDefinition): MonoTypeOperatorFunction<HubAction>;
export declare const mapToHub: () => import("rxjs").OperatorFunction<{
    hubName: string;
    url: string;
}, ISignalRHub | undefined>;
declare type ObservableMapHubToActionInput = {
    action: HubAction;
    hub: ISignalRHub;
};
declare type ObservableMapHubToActionFunc<T extends Action> = (input: ObservableMapHubToActionInput) => Observable<T>;
export declare const mergeMapHubToAction: <T extends Action>(func: ObservableMapHubToActionFunc<T>) => import("rxjs").OperatorFunction<HubAction, ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubNotFound">) | T>;
export declare const switchMapHubToAction: <T extends Action>(func: ObservableMapHubToActionFunc<T>) => import("rxjs").OperatorFunction<HubAction, ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubNotFound">) | T>;
export declare const exhaustMapHubToAction: <T extends Action>(func: ObservableMapHubToActionFunc<T>) => import("rxjs").OperatorFunction<HubAction, ({
    hubName: string;
    url: string;
} & import("@ngrx/store/src/models").TypedAction<"@ngrx/signalr/hubNotFound">) | T>;
export {};
