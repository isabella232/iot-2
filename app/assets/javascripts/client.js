Faye.logger = window.console;

var lineChart;
var barChart;
var measure = 0;
var lineData = [
  { key: 'Temperature', values: [] },
  { key: 'Pressure',    values: [] },
  { key: 'Humidity',    values: [] },
  { key: 'Luminosity',  values: [] },
  { key: 'Wind',        values: [] },
];
var barData = [{
  key: 'BarChart data',
  values: [
    { label: 'Temperature', value: 0 },
    { label: 'Pressure',    value: 0 },
    { label: 'Humidity',    value: 0 },
    { label: 'Luminosity',  value: 0 },
    { label: 'Wind',        value: 0 },
  ]
}];
var tbody = $('#data tbody');

var client = new Faye.Client('/iot', {proxy: {headers: {'User-Agent': 'Faye'}}});

var subscription = client.subscribe('/sensor', function(message) {
  $('.success', tbody).removeClass('success');

  var html = '<tr class="success">';

  $.each(message.data, function(i, e){
    e = parseFloat(e);

    if( i != message.data.length - 1 ) {
      lineData[i].values.push({ x: measure, y: e });
      barData[0].values[i].value = e;
      html += '<td>' + e + '</td>';

      if(lineData[i].values.length > 50)
        lineData[i].values.shift();

    } else {
      $('#compass img').css('transform', 'rotate(' + e + 'deg)');
    }
  });

  measure += 1;

  html += '</tr>';

  tbody.prepend($(html));

  var trs = $('tr', tbody);

  if(trs.size() > 25)
    trs.slice(25 - trs.size()).remove();

  lineChart.update();
  barChart.update();
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
  lineChart = nv.models.lineChart()
    .options({
      transitionDuration: 300,
      useInteractiveGuideline: true
    });

  lineChart.xAxis
    .axisLabel('# measure')
    .tickFormat(d3.format(',r'))
    .staggerLabels(true);

  lineChart.yAxis
    .axisLabel('Value')
    .tickFormat(d3.format(',.2f'));

  d3.select('#line-chart svg')
    .datum(lineData)
    .call(lineChart);

  nv.utils.windowResize(lineChart.update);

  lineChart.interpolate("monotone")

  return lineChart;
});

nv.addGraph(function() {
  barChart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(true)
      .tooltips(false)
      .showValues(true);

  d3.select('#bar-chart svg')
      .datum(barData)
      .call(barChart);

  nv.utils.windowResize(barChart.update);

  return barChart;
});
