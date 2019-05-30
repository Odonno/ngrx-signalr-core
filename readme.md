# ngrx-signalr-core

A library to handle realtime SignalR (.NET Core) events using angular, rxjs and the @ngrx library.

*This library is made for the SignalR client using .NET Core. If you need to target .NET Framework, please check this repository : https://github.com/Odonno/ngrx-signalr*

## Get started

### Install dependencies

```
npm install rxjs @ngrx/store @ngrx/effects @aspnet/signalr --save
npm install ngrx-signalr-core --save
```

Once everything is installed, you can use the reducer and the effects inside the `AppModule`.

```js
@NgModule({
    ...,
    imports: [
        StoreModule.forRoot({ signalr: signalrReducer }),
        EffectsModule.forRoot([SignalREffects, AppEffects])
    ],
    ...
})
export class AppModule { }
```

### Start with a single Hub

First, you will start the application by dispatching the creation of one Hub.

```ts
const hub = {
    name: 'hub name',
    url: 'https://localhost/path'
};

this.store.dispatch(
    createSignalRHub(hub.name, hub.url)
);
```

Then you will create an effect to start listening to events before starting the Hub.

```ts
@Effect()
initRealtime$ = this.actions$.pipe(
    ofType<SignalRHubUnstartedAction>(SIGNALR_HUB_UNSTARTED),
    mergeMap<SignalRHubUnstartedAction, any>(action => {
        const hub = findHub(action);

        if (!hub) {
            return of(realtimeError(new Error('No SignalR Hub found...')));
        }

        // add event listeners
        const whenEvent$ = hub.on('eventName').pipe(
            map(x => createAction(x))
        );

        return merge(
            whenEvent$,
            of(startSignalRHub(action.hubName, action.url))
        );
    })
);
```

You can also send events at anytime.

```ts
@Effect()
sendEvent$ = this.actions$.pipe(
    ofType(SEND_EVENT),
    mergeMap(action => {
        const hub = findHub(action);

        if (!hub) {
            return of(realtimeError(new Error('No SignalR Hub found...')));
        }

        return hub.send('eventName', params).pipe(
            map(_ => sendEventFulfilled()),
            catchError(error => of(sendEventFailed(error)))
        );
    })
);
```

### Using multiple Hubs

Now, start with multiple hubs at a time.

```ts
const dispatchHubCreation = (hub) => 
    this.store.dispatch(
        createSignalRHub(hub.name, hub.url)
    );

const hub1 = {}; // define name and url
const hub2 = {}; // define name and url
const hub3 = {}; // define name and url

dispatchHubCreation(hub1);
dispatchHubCreation(hub2);
dispatchHubCreation(hub3);
```

You will then initialize your hubs in the same way but you need to know which one is initialized.

```ts
const hub1 = {}; // define name and url
const hub2 = {}; // define name and url

@Effect()
initHubOne$ = this.actions$.pipe(
    ofType<SignalRHubUnstartedAction>(SIGNALR_HUB_UNSTARTED),
    ofHub(hub1),
    mergeMap<SignalRHubUnstartedAction, any>(action => {
        // TODO : init hub 1
    })
);

@Effect()
initHubTwo$ = this.actions$.pipe(
    ofType<SignalRHubUnstartedAction>(SIGNALR_HUB_UNSTARTED),
    ofHub(hub2),
    mergeMap<SignalRHubUnstartedAction, any>(action => {
        // TODO : init hub 2
    })
);
```

And then you can start your app when all hubs are connected the first time.

```ts
@Effect()
appStarted$ = this.store.select(selectAreAllHubsConnected).pipe(
    filter(areAllHubsConnected => !!areAllHubsConnected),
    first(),
    map(_ => of(appStarted()))
);
```

## Features

### SignalR Hub

The SignalR Hub is an abstraction of the hub connection. It contains function you can use to:

* start the connection
* listen to events emitted
* send a new event

```ts
class SignalRHub {
    hubName: string;
    url: string | undefined;
    options: IHttpConnectionOptions | undefined;

    start$: Observable<void>;
    state$: Observable<string>;
    error$: Observable<Error | undefined>;

    constructor(hubName: string, url: string, options: IHttpConnectionOptions | undefined);

    start(): Observable<void>;
    on<T>(eventName: string): Observable<T>;
    send(methodName: string, ...args: any[]): Observable<any>;
    hasSubscriptions(): boolean;
}
```

You can find an existing hub by its name and url.

```ts
function findHub(hubName: string, url: string): SignalRHub | undefined;
function findHub({ hubName, url }: {
    hubName: string;
    url: string;
}): SignalRHub | undefined;
```

And create a new hub.

```ts
function createHub(hubName: string, url: string, options: IHttpConnectionOptions | undefined): SignalRHub;
```

### State

The state contains all existing hubs that was created with their according status (unstarted, connected, disconnected).

```ts
const unstarted = "unstarted";
const connected = "connected";
const disconnected = "disconnected";

type SignalRHubState = 
    | typeof unstarted 
    | typeof connected 
    | typeof disconnected ;

type SignalRHubStatus = {
    hubName: string;
    url: string;
    state: SignalRHubState | undefined;
};
```

```ts
class BaseSignalRStoreState {
    hubStatuses: SignalRHubStatus[];
}
```

### Actions

#### Actions to dispatch

`createSignalRHub` will initialize a new hub connection but it won't start the connection so you can create event listeners.

```ts
const createSignalRHub = (hubName: string, url: string, options: IHttpConnectionOptions | undefined) => 
    ({ type: SIGNALR_CREATE_HUB, hubName, url, options });
```

`startSignalRHub` will start the hub connection so you can send and receive events.

```ts
const startSignalRHub = (hubName: string, url: string) => 
    ({ type: SIGNALR_START_HUB, hubName, url });
```

`reconnectSignalRHub` will give you a way to reconnect to the hub.

#### All existing actions

```ts
// used to create a new hub connection
type SignalRCreateHubAction = {
    type: "@ngrx/signalr/createHub";
    hubName: string;
    url: string;
    options: IHttpConnectionOptions | undefined;
};
// once the hub is created (default hub state)
type SignalRHubUnstartedAction = {
    type: "@ngrx/signalr/hubUnstarted";
    hubName: string;
    url: string;
};
// used to start the hub connection
type SignalRStartHubAction = {
    type: "@ngrx/signalr/startHub";
    hubName: string;
    url: string;
};
// used to reconnect to the hub connection
type SignalRReconnectHubAction = {
    type: "@ngrx/signalr/reconnectHub";
    hubName: string;
    url: string;
};
// if the hub connection failed to start
type SignalRHubFailedToStartAction = {
    type: "@ngrx/signalr/hubFailedToStart";
    hubName: string;
    url: string;
    error: any;
};
// connected event received from hub
type SignalRConnectedAction = {
    type: "@ngrx/signalr/connected";
    hubName: string;
    url: string;
};
// disconnected event received from hub
type SignalRDisconnectedAction = {
    type: "@ngrx/signalr/disconnected";
    hubName: string;
    url: string;
};
// error event received from hub
type SignalRErrorAction = {
    type: "@ngrx/signalr/error";
    hubName: string;
    url: string;
    error: any;
};
```

### Effects

```ts
// create hub automatically
@Effect()
createHub$: Observable<{
    type: string;
    hubName: string;
    url: string;
}>;
```

```ts
// listen to start result (success/fail)
// listen to change connection state (connecting, connected, disconnected, reconnecting)
// listen to hub error
@Effect()
beforeStartHub$: Observable<{
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
}>;
```

```ts
// start hub automatically
@Effect({ dispatch: false })
startHub$: Observable<SignalRStartHubAction>;
```

### Selectors

```ts
// used to select all hub statuses in state
const hubStatuses$ = store.select(selectHubsStatuses);

// used to select a single hub status based on its name and url
const hubStatus$ = store.select(selectHubStatus, { hubName, url });

// used to know if all hubs are connected
const areAllHubsConnected$ = store.select(selectAreAllHubsConnected);
```

## Publish a new version

First compile using `tsc` and then publish to npm registry.

```
tsc
npm publish --access public
```
