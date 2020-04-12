using Microsoft.AspNetCore.SignalR;
using RealtimeFeed.Api.Models;
using RealtimeFeed.Api.Services;
using System;
using System.Linq;
using System.Reactive.Linq;
using System.Threading.Tasks;

namespace RealtimeFeed.Api.Hubs
{
    public interface IFeedHubClient
    {
        Task FeedsLoaded(LoadFeedsResponse response);
        Task FeedCreated(Feed feed);
    }

    public class FeedHub : Hub<IFeedHubClient>
    {
        private readonly RealtimeFeedService _realtimeFeedService;

        public FeedHub(RealtimeFeedService realtimeFeedService)
        {
            _realtimeFeedService = realtimeFeedService;
        }

        public Task LoadFeeds()
        {
            var feedsToLoad = _realtimeFeedService.Feeds
                .OrderByDescending(f => f.CreatedAt)
                .Take(20)
                .ToList();

            var minFeedDate = _realtimeFeedService.Feeds.Any()
                ? _realtimeFeedService.Feeds.Min(f => f.CreatedAt)
                : (DateTime?)null;
            var minLoadedFeedDate = feedsToLoad.Any()
                ? feedsToLoad.Min(f => f.CreatedAt)
                : (DateTime?)null;

            var response = new LoadFeedsResponse
            {
                Feeds = feedsToLoad,
                CanLoadMore = minFeedDate.HasValue && minLoadedFeedDate.HasValue && minFeedDate.Value < minLoadedFeedDate.Value
            };

            return Clients.Caller.FeedsLoaded(response);
        }
        public Task LoadMoreFeeds(DateTime beforeDate)
        {
            var feedsToLoad = _realtimeFeedService.Feeds
                .Where(f => f.CreatedAt < beforeDate)
                .OrderByDescending(f => f.CreatedAt)
                .Take(20)
                .ToList();

            var minFeedDate = _realtimeFeedService.Feeds.Any() 
                ? _realtimeFeedService.Feeds.Min(f => f.CreatedAt) 
                : (DateTime?)null;
            var minLoadedFeedDate = feedsToLoad.Any() 
                ? feedsToLoad.Min(f => f.CreatedAt) 
                : (DateTime?)null;

            var response = new LoadFeedsResponse
            {
                Feeds = feedsToLoad,
                CanLoadMore = minFeedDate.HasValue && minLoadedFeedDate.HasValue && minFeedDate.Value < minLoadedFeedDate.Value
            };

            return Clients.Caller.FeedsLoaded(response);
        }
    }
}
