import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Feed } from '../models';
import { RootState } from '../state';
import { selectFeeds } from '../feeds.selectors';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
  feeds$: Observable<Feed[]>;

  constructor(store: Store<RootState>) {
    this.feeds$ = store.pipe(
      select(selectFeeds)
    );
  }

  ngOnInit(): void {
  }
}
