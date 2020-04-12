using System;

namespace RealtimeFeed.Api.Models
{
    public class Feed
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
