using Microsoft.AspNetCore.SignalR;
using RealtimeFeed.Api.Models;
using RealtimeFeed.Api.Services;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Threading.Tasks;

namespace RealtimeFeed.Api.Hubs
{
    public interface IFeedHubClient
    {
        Task FeedsLoaded(IEnumerable<Feed> feeds);
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
            var feedsToLoad = _realtimeFeedService.Feeds.Take(20);
            return Clients.Caller.FeedsLoaded(feedsToLoad);
        }
    }
}
