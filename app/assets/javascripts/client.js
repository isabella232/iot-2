Faye.logger = window.console;

var lineChart;
var barChart;
var measure = 0;
var lineData = [
  { key: 'Temperature', values: [] },
  { key: 'Pressure',    values: [] },
  { key: 'Humidity',    values: [] },
  { key: 'Luminosity',  values: [], color: "#2ca02c" },
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
    lineData[i].values.push({ x: measure, y: parseFloat(e) });
    barData[0].values[i].value = parseFloat(e);

    if(lineData[i].values.length > 50)
      lineData[i].values.shift();

    html += '<td>' + e + '</td>';
  });

  measure += 1;

  html += '</tr>';

  tbody.prepend($(html));
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

  lineChart.isArea(false)
  lineChart.interpolate("linear")
  return lineChart;
});

nv.addGraph(function() {
  barChart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(false)        //Don't show tooltips
      .showValues(true);      //...instead, show the bar value right on top of each bar.

  d3.select('#bar-chart svg')
      .datum(barData)
      .call(barChart);

  nv.utils.windowResize(barChart.update);

  return barChart;
});
