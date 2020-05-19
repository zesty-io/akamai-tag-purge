# Akamai Fast Purge for Cache Tags

Fast Purge Cloud Function for GCP to purge specific akamai cache by "cache-tags"

## About Akamai Fast Purge 

Estimated Time to Purge (We have witnessed seconds to minutes), but the api request will return a EstimatedTime. It appears to always say 5 seconds.

Documentation: https://developer.akamai.com/api/core_features/fast_purge/v3.html#tagrequest
```estimatedSeconds	Integer	The estimated number of seconds before the purge is to complete.```


```Fast Purge is a web interface available on the Control Center that lets you refresh specific cached objects or remove all objects by URLs, content provider (CP) codes, cache tags, and ARLs across the Akamai edge network in just a few seconds. This is extremely useful, especially in situations when you need to quickly correct mistakes in your published content. You can automate your content purge requests via the Fast Purge API.``` 
Read more https://learn.akamai.com/en-us/webhelp/fast-purge/fast-purge/GUID-3A497865-28DF-4CAB-A507-F588F21368F8.html

## Note on Akamai Fast Purge Rate Limiting

```For example, the token bucket for cache tags holds 5,000 tokens and refills at a rate of 500 tokens per minute. You can submit a burst of 5,000 cache tags if the token bucket is full, but this completely empties the token bucket. Cache tag tokens are refilled at 500 tokens per minute, so after one minute, the bucket has 500 tokens in it and another request with up to 500 objects can be processed.```

https://developer.akamai.com/api/core_features/fast_purge/v3.html#ratelimits