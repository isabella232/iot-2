Faye.logger = window.console;

var chart;
var measure = 0;
var data = [
  { key: 'temperature', values: [{x: 0, y: 0}], area: false },
  { key: 'humidity', values: [{x: 0, y: 0}], area: false },
  { key: 'light', values: [{x: 0, y: 0}], area: false },
  { key: 'preasure', values: [{x: 0, y: 0}], area: false },
  { key: 'wind', values: [{x: 0, y: 0}], area: false },
]

var client = new Faye.Client('http://localhost:3000/iot', {proxy: {headers: {'User-Agent': 'Faye'}}});

var tbody = $('#data tbody');

var subscription = client.subscribe('/sensor', function(message) {
  $('.success', tbody).removeClass('success');

  var html = '<tr class="success">';

  $.each(message.data, function(i, e){
    data[i].values.push({ x: measure, y: parseFloat(e) });

    if(data[i].values.length > 10)
      data[i].values.shift();

    html += '<td>' + e + '</td>';
  });

  measure += 1;

  html += '</tr>';

  tbody.prepend($(html));
  chart.update();
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

nv.addGraph(function() {
  chart = nv.models.lineChart()
    .options({
      transitionDuration: 300,
      useInteractiveGuideline: true
    });

  chart.xAxis
    .axisLabel('# measure')
    .tickFormat(d3.format(',r'))
    .staggerLabels(true);

  chart.yAxis
    .axisLabel('Value')
    .tickFormat(d3.format(',.2f'));

  d3.select('#chart svg')
    .datum(data)
    .call(chart)
    ;

  nv.utils.windowResize(chart.update);

  return chart;
});
