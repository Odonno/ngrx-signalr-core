var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, merge, empty } from "rxjs";
import { map, mergeMap, catchError, tap, filter } from 'rxjs/operators';
import { SIGNALR_HUB_UNSTARTED, SIGNALR_HUB_FAILED_TO_START, SIGNALR_ERROR, SIGNALR_CONNECTED, SIGNALR_DISCONNECTED, SIGNALR_CREATE_HUB, SIGNALR_START_HUB, SIGNALR_RECONNECT_HUB } from "./actions";
import { findHub, createHub } from "./hub";
export function ofHub(x, url) {
    if (typeof x === 'string') {
        return filter(action => action.hubName === x && action.url === url);
    }
    else {
        return filter(action => action.hubName === x.hubName && action.url === x.url);
    }
}
let SignalREffects = class SignalREffects {
    constructor(actions$) {
        this.actions$ = actions$;
        // handle hub creation (then hub unstarted by default)
        this.createHub$ = this.actions$.pipe(ofType(SIGNALR_CREATE_HUB), mergeMap(action => {
            const hub = createHub(action.hubName, action.url, action.options);
            return of({ type: SIGNALR_HUB_UNSTARTED, hubName: hub.hubName, url: hub.url });
        }));
        // listen to start result (success/fail)
        // listen to change connection state (connected, disconnected)
        // listen to hub error
        this.beforeStartHub$ = this.actions$.pipe(ofType(SIGNALR_HUB_UNSTARTED), mergeMap(action => {
            const hub = findHub(action.hubName, action.url);
            if (!hub) {
                return empty();
            }
            const start$ = hub.start$.pipe(mergeMap(_ => empty()), catchError(error => of(({ type: SIGNALR_HUB_FAILED_TO_START, hubName: action.hubName, url: action.url, error }))));
            const state$ = hub.state$.pipe(map(state => {
                if (state === 'connected') {
                    return { type: SIGNALR_CONNECTED, hubName: action.hubName, url: action.url };
                }
                if (state === 'disconnected') {
                    return { type: SIGNALR_DISCONNECTED, hubName: action.hubName, url: action.url };
                }
            }));
            const error$ = hub.error$.pipe(map(error => ({ type: SIGNALR_ERROR, hubName: action.hubName, url: action.url, error })));
            return merge(start$, state$, error$);
        }));
        // start hub
        this.startHub$ = this.actions$.pipe(ofType(SIGNALR_START_HUB, SIGNALR_RECONNECT_HUB), tap(action => {
            const hub = findHub(action);
            if (hub) {
                hub.start();
            }
        }));
    }
};
__decorate([
    Effect(),
    __metadata("design:type", Object)
], SignalREffects.prototype, "createHub$", void 0);
__decorate([
    Effect(),
    __metadata("design:type", Object)
], SignalREffects.prototype, "beforeStartHub$", void 0);
__decorate([
    Effect({ dispatch: false }),
    __metadata("design:type", Object)
], SignalREffects.prototype, "startHub$", void 0);
SignalREffects = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [Actions])
], SignalREffects);
export { SignalREffects };
