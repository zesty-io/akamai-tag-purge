require('env-yaml').config();

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

  var EdgeGrid = require('edgegrid');

  var eg = new EdgeGrid(
    process.env.AKAMAI_CLIENT_TOKEN, 
    process.env.AKAMAI_CLIENT_SECRET, 
    process.env.AKAMAI_ACCESS_TOKEN, 
    process.env.AKAMAI_HOST);

  /// caches tag
  
  var cacheTags = {
      "objects": [
          "Foo",
          "Bar"
      ]
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
      res.json(body);
    }
  });
}