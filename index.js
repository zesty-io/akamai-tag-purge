var akamai = require('akamai');
require('env-yaml').config();

akamai.purge('john@example.com', '...', [
  'http://example.com/somewhere',
  'http://example.com/cool',
  'http://example.com/but',
  'http://example.com/nowhere',
  'http://example.com/real'
], {domain: 'staging', action: 'invalidate'}).then(function (response) {
  console.log(response);
}).catch(function (err) {
  console.log(err.body);
  console.trace();
});