# ngrx-signalr-core

A library to handle realtime SignalR (.NET Core) events using angular, rxjs and the @ngrx library.

_This library is made for the SignalR client using .NET Core. If you need to target .NET Framework, please check this repository : https://github.com/Odonno/ngrx-signalr_

## Get started

### Install dependencies

```
npm install rxjs @ngrx/store @ngrx/effects @microsoft/signalr --save
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

<details>
<summary>Start with a single Hub...</summary>
<br>

First, you will start the application by dispatching the creation of one Hub.

```ts
// TODO : your hub definition
const hub = {
  hubName: "hub name",
  url: "https://localhost/path",
};

this.store.dispatch(createSignalRHub(hub));
```

Creating a SignalR Hub is not enough. You need to start it manually.

```ts
initRealtime$ = createEffect(() =>
  this.actions$.pipe(
    ofType(signalrHubUnstarted),
    map((hub) => startSignalRHub(hub))
  )
);
```

Then you will create an effect to start listening to events once the hub is connected.

```ts
listenToEvents$ = createEffect(() =>
  this.actions$.pipe(
    ofType(signalrConnected),
    mergeMapHubToAction(({ hub }) => {
      // TODO : add event listeners
      const whenEvent1$ = hub
        .on("eventName1")
        .pipe(map((x) => createAction(x)));
      const whenEvent2$ = hub
        .on("eventName2")
        .pipe(map((x) => createAction(x)));

      return merge(whenEvent1$, whenEvent2$);
    })
  )
);
```

You can also send events at anytime.

```ts
sendEvent$ = createEffect(() =>
  this.actions$.pipe(
    ofType(SEND_EVENT), // TODO : create a custom action
    mergeMap(({ params }) => {
      const hub = findHub(timeHub);
      if (!hub) {
        return of(hubNotFound(timeHub));
      }

      // TODO : send event to the hub
      return hub.send("eventName", params).pipe(
        map((_) => sendEventFulfilled()),
        catchError((error) => of(sendEventFailed(error)))
      );
    })
  )
);
```

</details>

<details>
<summary>...or use multiple Hubs</summary>
<br>

Now, start with multiple hubs at a time.

```ts
// simplified hub creation
const dispatchHubCreation = (hub) => this.store.dispatch(createSignalRHub(hub));

const hub1 = {}; // define hubName and url
const hub2 = {}; // define hubName and url
const hub3 = {}; // define hubName and url

dispatchHubCreation(hub1);
dispatchHubCreation(hub2);
dispatchHubCreation(hub3);
```

You will then initialize your hubs in the same way but you need to know which one is initialized.

```ts
const hub1 = {}; // define hubName and url
const hub2 = {}; // define hubName and url

initHubOne$ = createEffect(() =>
  this.actions$.pipe(
    ofType(signalrHubUnstarted),
    ofHub(hub1),
    mergeMapHubToAction(({ action, hub }) => {
      // TODO : init hub 1
    })
  )
);

initHubTwo$ = createEffect(() =>
  this.actions$.pipe(
    ofType(signalrHubUnstarted),
    ofHub(hub2),
    mergeMapHubToAction(({ action, hub }) => {
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
    filter((areAllHubsConnected) => !!areAllHubsConnected),
    first(),
    map((_) => of(appStarted())) // TODO : create a custom action when hubs are connected
  )
);
```

</details>

<details>
<summary>Handling reconnection</summary>
<br>

~~Since .NET Core, you need to handle the SignalR Hub reconnection by yourself.~~

The simple way to enable hub reconnection is to enable `automatic reconnect` when creating the hub. You can use one of the 3 options described here:

```ts
// Using the Default reconnection policy.
// By default, the client will wait 0, 2, 10 and 30 seconds respectively before trying up to 4 reconnect attempts.
const action = createSignalRHub(hub, url, options, true);

// Using an array containing the delays in milliseconds before trying each reconnect attempt.
// The length of the array represents how many failed reconnect attempts it takes before the client will stop attempting to reconnect.
const action = createSignalRHub(hub, url, options, [10000, 20000, 30000]); // after 10s, after 20s, after 30s

// Using a custom reconnect policy.
// The retry policy that controls the timing and number of reconnect attempts.
const action = createSignalRHub(hub, url, options, {
  nextRetryDelayInMilliseconds: (context) => {
    // ...
    return 10000;
  },
});

this.store.dispatch(action);
```

It is currently deprecated but you can perform your own reconnection strategy using the power of @ngrx. Here is an example on how to apply periodic reconnection:

```ts
// try to reconnect all hubs every 10s (when the navigator is online)
whenDisconnected$ = createReconnectEffect(this.actions$);
```

In this example, we did not use a custom reconnection policy. So the default behavior will automatically be to apply a periodic reconnection attempt every 10 seconds when the hub is `disconnected` and when there is a network connection.

Of course, you can write your own `reconnectionPolicy` inside the options of the function, so you have the benefit to write your own reconnection pattern (periodic retry, exponential retry, etc..).

You can also filter by `hubName` so that it will affect only one hub.

</details>

## API features

<details>
<summary>SignalR Hub</summary>
<br>

The SignalR Hub is an abstraction of the hub connection. It contains function you can use to:

- start the connection
- listen to events emitted
- send a new event

```ts
interface ISignalRHub {
  hubName: string;
  url: string;
  options: IHttpConnectionOptions | undefined;

  start$: Observable<void>;
  stop$: Observable<void>;
  state$: Observable<string>;
  error$: Observable<Error | undefined>;

  constructor(
    hubName: string,
    url: string,
    options: IHttpConnectionOptions | undefined
  );

  start(): Observable<void>;
  stop(): Observable<void>;
  on<T>(eventName: string): Observable<T>;
  stream<T>(methodName: string, ...args: any[]): Observable<T>;
  send<T>(methodName: string, ...args: any[]): Observable<T>;
  sendStream<T>(methodName: string, subject: Subject<T>): Observable<void>;
  hasSubscriptions(): boolean;
}
```

You can find an existing hub by its name and url.

```ts
function findHub(hubName: string, url: string): ISignalRHub | undefined;
function findHub({
  hubName,
  url,
}: {
  hubName: string;
  url: string;
}): ISignalRHub | undefined;
```

And create a new hub.

```ts
function createHub(
  hubName: string,
  url: string,
  options: IHttpConnectionOptions | undefined
): ISignalRHub | undefined;
```

</details>

<details>
<summary>State</summary>
<br>

The state contains all existing hubs that was created with their according status (unstarted, connected, disconnected).

```ts
const unstarted = "unstarted";
const connected = "connected";
const disconnected = "disconnected";

type SignalRHubState =
  | typeof unstarted
  | typeof connected
  | typeof disconnected;

type SignalRHubStatus = {
  hubName: string;
  url: string;
  state: SignalRHubState;
};
```

```ts
class BaseSignalRStoreState {
  hubStatuses: SignalRHubStatus[];
}
```

</details>

<details>
<summary>Actions</summary>
<br>

#### Actions to dispatch

`createSignalRHub` will initialize a new hub connection but it won't start the connection so you can create event listeners.

```ts
const createSignalRHub = createAction(
  "@ngrx/signalr/createHub",
  props<{
    hubName: string;
    url: string;
    options?: IHttpConnectionOptions | undefined;
  }>()
);
```

`startSignalRHub` will start the hub connection so you can send and receive events.

```ts
const startSignalRHub = createAction(
  "@ngrx/signalr/startHub",
  props<{ hubName: string; url: string }>()
);
```

`stopSignalRHub` will stop the current hub connection.

```ts
const stopSignalRHub = createAction(
  "@ngrx/signalr/stopHub",
  props<{ hubName: string; url: string }>()
);
```

`reconnectSignalRHub` will give you a way to reconnect to the hub.

```ts
const reconnectSignalRHub = createAction(
  "@ngrx/signalr/reconnectHub",
  props<{ hubName: string; url: string }>()
);
```

`hubNotFound` can be used when you do retrieve your SignalR hub based on its name and url.

```ts
const hubNotFound = createAction(
  "@ngrx/signalr/hubNotFound",
  props<{ hubName: string; url: string }>()
);
```

</details>

<details>
<summary>Effects</summary>
<br>

```ts
// create hub automatically
createHub$;
```

```ts
// listen to start result (success/fail)
// listen to change connection state (connecting, connected, disconnected, reconnecting)
// listen to hub error
beforeStartHub$;
```

```ts
// start hub automatically
startHub$;
```

```ts
// stop hub
stopHub$;
```

</details>

<details>
<summary>Selectors</summary>
<br>

```ts
// used to select all hub statuses in state
const hubStatuses$ = store.pipe(select(selectHubsStatuses));

// used to select a single hub status based on its name and url
const hubStatus$ = store.pipe(select(selectHubStatus, { hubName, url }));

// used to know if all hubs are connected
const areAllHubsConnected$ = store.pipe(select(selectAreAllHubsConnected));

// used to know when a hub is in a particular state
const hasHubState$ = store.pipe(
  select(selectHasHubState, { hubName, url, state })
);
```

</details>
