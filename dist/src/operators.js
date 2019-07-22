import { of } from "rxjs";
import { filter, map, mergeMap, exhaustMap, switchMap } from "rxjs/operators";
import { findHub } from "./hub";
import { hubNotFound } from "./actions";
export function ofHub(x, url) {
    if (typeof x === 'string') {
        return filter(action => action.hubName === x && action.url === url);
    }
    else {
        return filter(action => action.hubName === x.hubName && action.url === x.url);
    }
}
export const mapToHub = () => map(findHub);
const hubAndActionOrNotFound = (func) => (action) => {
    const hub = findHub(action);
    if (!hub) {
        return of(hubNotFound(action));
    }
    return func({ action, hub });
};
export const mergeMapHubToAction = (func) => mergeMap(hubAndActionOrNotFound(func));
export const switchMapHubToAction = (func) => switchMap(hubAndActionOrNotFound(func));
export const exhaustMapHubToAction = (func) => exhaustMap(hubAndActionOrNotFound(func));
