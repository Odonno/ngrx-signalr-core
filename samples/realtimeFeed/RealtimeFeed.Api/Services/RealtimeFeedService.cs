using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using RealtimeFeed.Api.Hubs;
using RealtimeFeed.Api.Models;
using System;
using System.Collections.Generic;
using System.Reactive.Linq;

namespace RealtimeFeed.Api.Services
{
    public class RealtimeFeedService
    {
        private readonly IServiceProvider _serviceProvider;

        public readonly List<Feed> Feeds = new List<Feed>();

        public RealtimeFeedService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;

            Observable.Interval(TimeSpan.FromSeconds(10))
                .Subscribe(index =>
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var newFeed = new Feed
                        {
                            Id = index + 1,
                            Title = "Random title",
                            Content = "Random content...",
                            CreatedAt = DateTime.Now
                        };

                        Feeds.Add(newFeed);

                        var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<FeedHub, IFeedHubClient>>();
                        hubContext.Clients.All.FeedCreated(newFeed);
                    }
                });
        }
    }
}
