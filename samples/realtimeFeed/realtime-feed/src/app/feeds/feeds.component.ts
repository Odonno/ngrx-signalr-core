import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Feed } from '../models';
import { RootState } from '../state';
import { selectFeeds, selectCanLoadMore } from '../feeds.selectors';
import { loadMoreFeeds } from '../feeds.actions';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
  feeds$: Observable<Feed[]>;
  canLoadMore$: Observable<boolean>;

  constructor(private readonly store: Store<RootState>) {
    this.feeds$ = store.pipe(
      select(selectFeeds)
    );

    this.canLoadMore$ = store.pipe(
      select(selectCanLoadMore)
    );
  }

  ngOnInit(): void {
  }

  trackById = (feed: Feed) => feed.id;

  onLoadMoreButtonClicked = () => {
    this.store.dispatch(
      loadMoreFeeds()
    );
  }
}
