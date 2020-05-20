# Akamai Fast Purge for Cache Tags

Fast Purge Cloud Function for GCP to purge specific akamai cache by "cache-tags"

## How to Configure and Test

Prequisistes: have NPM (node package manager) and NVM (node version manager) installed

1. Run in terminal at root: `nvm use v10` and `npm install`
2. Copy `.env.example.yml` to `.env.yml` and replace the values from API keys you get from AKAMAI with purge and admin permission. Note the env is either stage or prod. The service key is sent when making a post request to prevent spam or unauthorized requests
3. Run in terminal at root: `npm run test` 

You should see out like this:

```
{"detail": "Request accepted", "estimatedSeconds": 5, "purgeId": "XXXXXXXX-9a53-XXXXX-aa24-498812ce210a", "supportId": "17PY15XXXXXXXX567174-24900000056", "httpStatus": 201}
```

If you do not get that output try to issue new API keys. Make sure they have purge and admin permission. Also check the Akamai envirnoment you are testing against.

## How to deploy to a GCP cloud function

1. Install gcloud sdk cli tools https://cloud.google.com/sdk/docs#install_the_latest_cloud_tools_version_cloudsdk_current_version
2. Authenticate with google https://cloud.google.com/sdk/gcloud/reference/auth
3. `gcloud  functions deploy akamaiFastPurge --env-vars-file .env.yml --runtime nodejs10 --trigger-http --project YOUR-PROJECT-NAME`

## How to hii

# Notes on Akamai Fast Purge 

The request returns an Estimated Time to Purge value (EstimatedTime) upon 201, it has the value of 5 seconds. We have witnessed seconds to up to 10 minutes.

**From a Fastly Representative at 4:18:07 PM on 5.19.2020**

```The SLA for FastPurge might go to sometimes up to 7-8mins In best scenario within 1 mins. It totally depend on the Purge server traffic.```

Documentation: https://developer.akamai.com/api/core_features/fast_purge/v3.html#tagrequest
```estimatedSeconds	Integer	The estimated number of seconds before the purge is to complete.```


```Fast Purge is a web interface available on the Control Center that lets you refresh specific cached objects or remove all objects by URLs, content provider (CP) codes, cache tags, and ARLs across the Akamai edge network in just a few seconds. This is extremely useful, especially in situations when you need to quickly correct mistakes in your published content. You can automate your content purge requests via the Fast Purge API.``` 
Read more https://learn.akamai.com/en-us/webhelp/fast-purge/fast-purge/GUID-3A497865-28DF-4CAB-A507-F588F21368F8.html

## Note on Akamai Fast Purge Rate Limiting

```For example, the token bucket for cache tags holds 5,000 tokens and refills at a rate of 500 tokens per minute. You can submit a burst of 5,000 cache tags if the token bucket is full, but this completely empties the token bucket. Cache tag tokens are refilled at 500 tokens per minute, so after one minute, the bucket has 500 tokens in it and another request with up to 500 objects can be processed.```

https://developer.akamai.com/api/core_features/fast_purge/v3.html#ratelimits