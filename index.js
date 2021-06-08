require('env-yaml').config();
const https = require('https');

exports.akamaiFastPurge = (req, res) => {
  const cors = require("cors")();

  cors(req, res, () => {
    exportAkamaiFastPurge(req, res);
  });
};

// !TODO
// Intercept the cache tags as a body post
// Check if the service key matches the relative header value


const exportAkamaiFastPurge = async (req, res) => {
  // error handling
  if (req.method !== "POST") {
    return res.status(400).send("Error: expected HTTP POST.");
  }

  if (!req.get("X-Auth")) {
    return res.status(400).send(`Error: Requires "X-Auth" header with Service Key`);
  }

  let authKey = req.get("X-Auth");
  if(authKey !== process.env.SERVICE_KEY){
      return res.status(400).send("Error: service key does not match.");
  }



  var EdgeGrid = require('edgegrid');

  var eg = new EdgeGrid(
    process.env.AKAMAI_CLIENT_TOKEN, 
    process.env.AKAMAI_CLIENT_SECRET, 
    process.env.AKAMAI_ACCESS_TOKEN, 
    process.env.AKAMAI_HOST);

  /// caches tag
  
  var cacheTags = JSON.parse(req.body)
  zuid = cacheTags.objects[0]

  // purge the instances system cache, requires the Instance ZUID, check to see if zuid starts with 8- to represent an instance zuid https://zesty-io.github.io/zuid-specification/
  // this is done because its possible to purge other tags (not instance zuids) in Akamai 
  if(zuid.includes('8-')){
    https.get(`https://us-central1-zesty-prod.cloudfunctions.net/redisPurge?zuid=${zuid}`);
  }

  var headers = {
    "Content-Type": "application/json"
  };

  eg.auth({
    path: `/ccu/v3/invalidate/tag/${process.env.AKAMAI_ENV}`,
    method: 'POST',
    headers: headers,
    body: cacheTags
  })

  eg.send(function(error, response, body) {
    if(error != null){
      res.send(error);
    } else {
      res.json({
        'message' : 'Purge request sent successfully. Cache can refresh as soon as 5 seconds or as long as 8 minutes per Akamai SLA.',
        'cacheTagsPurged' : cacheTags.objects,
        'akamaiResponse' : JSON.parse(body)
      });
    }
  });
}