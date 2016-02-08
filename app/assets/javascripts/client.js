Faye.logger = window.console;

var client = new Faye.Client('http://localhost:3000/iot', {proxy: {headers: {'User-Agent': 'Faye'}}});

var tbody = $('#data tbody');

var subscription = client.subscribe('/sensor', function(message) {
  $('.success', tbody).removeClass('success');

  var html = '<tr class="success">';

  $.each(message.data, function(_, e){
    html += '<td>' + e + '</td>';
  });

  html += '</tr>';

  tbody.prepend($(html));
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
