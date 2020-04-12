using System.Collections.Generic;

namespace RealtimeFeed.Api.Models
{
    public class LoadFeedsResponse
    {
        public IEnumerable<Feed> Feeds { get; set; }
        public bool CanLoadMore { get; set; }
    }
}
