require('env-yaml').config();
var EdgeGrid = require('edgegrid');

var data = 'bodyData';

// Supply the path to your .edgerc file and name
// of the section with authorization to the client
// you are calling (default section is 'default')
var eg = new EdgeGrid({
  path: './.edgerc',
  section: 'default'
});


/// by hostname (not in use)
var byHostName ={
  "hostname": "origin.qux.com",
  "objects": [
    "/some/path/object1",
    "/some/other/path/object2"
  ]
}

/// caches tag
var cacheTags = {
    "objects": [
        "7-6c090c-nrqld1",
        "8-a8c1ccbff1-bfltqx"
    ]
}

var headers = {
  "Content-Type": "application/json"
};

eg.auth({
  path: '/ccu/v3/invalidate/tag/production',
  method: 'POST',
  headers: headers,
  body: cacheTags
})

eg.send(function(error, response, body) {
  if(error != null){
    console.log(error);
  } else {
    console.log(body);
  }
});