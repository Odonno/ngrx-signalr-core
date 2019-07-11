import { MonoTypeOperatorFunction } from "rxjs";
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
export declare const mapToHub: () => import("rxjs").OperatorFunction<{
    hubName: string;
    url: string;
}, import("./hub").ISignalRHub | undefined>;
export {};
