Faye.logger = window.console;

var client = new Faye.Client('http://localhost:3000/bayeux', {proxy: {headers: {'User-Agent': 'Faye'}}});

var subscription = client.subscribe('/chat/*', function(message) {
  var user = message.user;

  var publication = client.publish('/members/' + user, {
    user:     'node-logger',
    message:  ' Got your message, ' + user + '!'
  });
  publication.callback(function() {
    console.log('[PUBLISH SUCCEEDED]');
  });
  publication.errback(function(error) {
    console.log('[PUBLISH FAILED]', error);
  });
});

subscription.callback(function() {
  console.log('[SUBSCRIBE SUCCEEDED]');
});
subscription.errback(function(error) {
  console.log('[SUBSCRIBE FAILED]', error);
});

client.bind('transport:down', function() {
  console.log('[CONNECTION DOWN]');
});
client.bind('transport:up', function() {
  console.log('[CONNECTION UP]');
});
