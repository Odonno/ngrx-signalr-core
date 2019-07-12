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
// TODO : your hub definition
const hub = {
    name: 'hub name',
    url: 'https://localhost/path'
};

this.store.dispatch(
    createSignalRHub(hub)
);
```

Then you will create an effect to start listening to events before starting the Hub.

```ts
initRealtime$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SIGNALR_HUB_UNSTARTED),
        mergeMap(action => {
            const hub = findHub(action);

            if (!hub) {
                return of(hubNotFound(action));
            }

            // TODO : add event listeners
            const whenEvent$ = hub.on('eventName').pipe(
                map(x => createAction(x))
            );

            return merge(
                whenEvent$,
                of(startSignalRHub(hub))
            );
        })
    )
);
```

You can also send events at anytime.

```ts
sendEvent$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SEND_EVENT), // TODO : create a custom action
        mergeMap(action => {
            const hub = findHub(action);

            if (!hub) {
                return of(hubNotFound(action));
            }

            // TODO : send event to the hub
            return hub.send('eventName', params).pipe(
                map(_ => sendEventFulfilled()),
                catchError(error => of(sendEventFailed(error)))
            );
        })
    )
);
```

### Using multiple Hubs

Now, start with multiple hubs at a time.

```ts
// simplified hub creation
const dispatchHubCreation = (hub) => this.store.dispatch(createSignalRHub(hub));

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

initHubOne$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SIGNALR_HUB_UNSTARTED),
        ofHub(hub1),
        mergeMap(action => {
            // TODO : init hub 1
        })
    )
);

initHubTwo$ = createEffect(() => 
    this.actions$.pipe(
        ofType(SIGNALR_HUB_UNSTARTED),
        ofHub(hub2),
        mergeMap(action => {
            // TODO : init hub 2
        })
    )
);
```

And then you can start your app when all hubs are connected the first time.

```ts
appStarted$ = createEffect(() => 
    this.store.pipe(
        select(selectAreAllHubsConnected),
        filter(areAllHubsConnected => !!areAllHubsConnected),
        first(),
        map(_ => of(appStarted())) // TODO : create a custom action when hubs are connected
    )
);
```

### Handling reconnection

Since .NET Core, you need to handle the SignalR Hub reconnection by yourself. Here is an example on how to apply periodic reconnection:

```ts
// try to reconnect every 10s (when the navigator is online)
whenDisconnected$ = createReconnectEffect(this.actions$, 10 * 1000);
```

In this example, we apply a periodic reconnection attempt every 10 seconds when the hub is disconnected and when there is a network connection.

It has the disadvantage that you need to write another `Effect` but you also have the benefit to write your own reconnection pattern (periodic retry, exponential retry, etc..).

## Features

### SignalR Hub

The SignalR Hub is an abstraction of the hub connection. It contains function you can use to:

* start the connection
* listen to events emitted
* send a new event

```ts
interface ISignalRHub {
    hubName: string;
    url: string;
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
function findHub(hubName: string, url: string): ISignalRHub | undefined;
function findHub({ hubName, url }: {
    hubName: string;
    url: string;
}): ISignalRHub | undefined;
```

And create a new hub.

```ts
function createHub(hubName: string, url: string, options: IHttpConnectionOptions | undefined): ISignalRHub | undefined;
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
const createSignalRHub = createAction(
    '@ngrx/signalr/createHub',
    props<{ hubName: string, url: string, options?: IHttpConnectionOptions | undefined }>()
);
```

`startSignalRHub` will start the hub connection so you can send and receive events.

```ts
const startSignalRHub = createAction(
    '@ngrx/signalr/startHub',
    props<{ hubName: string, url: string }>()
);
```

`reconnectSignalRHub` will give you a way to reconnect to the hub.

```ts
const reconnectSignalRHub = createAction(
    '@ngrx/signalr/reconnectHub',
    props<{ hubName: string, url: string }>()
);
```

`hubNotFound` can be used when you do retrieve your SignalR hub based on its name and url.

```ts
export const hubNotFound = createAction(
    '@ngrx/signalr/hubNotFound',
    props<{ hubName: string, url: string }>()
);
```

### Effects

```ts
// create hub automatically
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
startHub$: Observable<SignalRStartHubAction>;
```

### Selectors

```ts
// select all hub statuses in state
const hubStatuses$ = store.pipe(
    select(selectHubsStatuses)
);

// select a single hub status based on its name and url
const hubStatus$ = store.pipe(
    select(selectHubStatus, { hubName, url })
);

// know if all hubs are connected
const areAllHubsConnected$ = store.pipe(
    select(selectAreAllHubsConnected)
);
```

## Publish a new version

First compile using `tsc` and then publish to npm registry.

```
tsc
npm publish --access public
```
