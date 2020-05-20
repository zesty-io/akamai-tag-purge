require('env-yaml').config();
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
    console.log('Error', error);
  } else {
    console.log('Success', body);
  }
});