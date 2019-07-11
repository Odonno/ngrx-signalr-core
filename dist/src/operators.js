import { filter, map } from "rxjs/operators";
import { findHub } from "./hub";
export function ofHub(x, url) {
    if (typeof x === 'string') {
        return filter(action => action.hubName === x && action.url === url);
    }
    else {
        return filter(action => action.hubName === x.hubName && action.url === x.url);
    }
}
export const mapToHub = () => map(findHub);
