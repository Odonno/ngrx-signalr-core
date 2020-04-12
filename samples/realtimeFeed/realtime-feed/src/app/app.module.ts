import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SignalREffects, signalrReducer } from 'ngrx-signalr-core';

import { AppComponent } from './app/app.component';
import { FeedsComponent } from './feeds/feeds.component';
import { environment } from 'src/environments/environment';
import { reducer } from './state';
import { FeedsEffects } from './feeds.effects';

@NgModule({
  declarations: [
    AppComponent,
    FeedsComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({
      app: reducer,
      signalr: signalrReducer
    }),
    EffectsModule.forRoot([
      SignalREffects,
      FeedsEffects
    ]),
    StoreDevtoolsModule.instrument({
      name: 'ngrx-signalr-core Samples - Realtime Feed',
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
