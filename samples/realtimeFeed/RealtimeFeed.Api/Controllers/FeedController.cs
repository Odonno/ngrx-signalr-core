using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RealtimeFeed.Api.Models;
using RealtimeFeed.Api.Services;

namespace RealtimeFeed.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedController : ControllerBase
    {
        private readonly RealtimeFeedService _realtimeFeedService;

        public FeedController(RealtimeFeedService realtimeFeedService)
        {
            _realtimeFeedService = realtimeFeedService;
        }

        [HttpGet]
        public IEnumerable<Feed> Get()
        {
            return _realtimeFeedService.Feeds;
        }
    }
}