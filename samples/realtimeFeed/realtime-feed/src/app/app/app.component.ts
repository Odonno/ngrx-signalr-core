import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../state';
import { createSignalRHub } from 'ngrx-signalr-core';
import { feedHub } from '../hubs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(store: Store<RootState>) {
    store.dispatch(
      createSignalRHub(feedHub)
    );
  }
}
