const slow = () =>
  d3
    .transition()
    .duration(500)
    .ease(d3.easeLinear);

const initChart = () => {
  const svg = d3
    .select("#chart-area svg")
    .attr("height", chartSize.height)
    .attr("width", chartSize.width);

  const g = svg
    .append("g")
    .attr("class", "equities")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - margin.top);

  g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("transform", "rotate(-90)");

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");
};

const updateChart = (quotes, fieldName) => {
  const format = fieldFormat[fieldName];
  const svg = d3.select("#chart-area svg");
  const maxDomain = _.get(_.maxBy(quotes, fieldName), fieldName, 0);
  const firstDate = new Date(_.first(quotes).Date);
  const lastDate = new Date(_.last(quotes).Date);

  const y = d3
    .scaleLinear()
    .domain([0, maxDomain])
    .range([height, 0]);

  svg.select(".y.axis-label").text(fieldName);

  const yAxis = d3
    .axisLeft(y)
    .ticks(10)
    .tickFormat(format);

  svg.select(".y.axis").call(yAxis);

  const x = d3
    .scaleTime()
    .domain([firstDate, lastDate])
    .range([0, width]);

  const xAxis = d3.axisBottom(x);

  svg
    .select(".x.axis")
    .transition(slow())
    .call(xAxis);

  const lineChart = d3
    .line()
    .x(quote => x(new Date(quote.Date)))
    .y(quote => y(quote[fieldName]));

  const quotesG = svg.select(".equities");

  quotesG
    .append("path")
    .attr("class", "close")
    .attr("d", lineChart(quotes));

  const avgChart = d3
    .line()
    .x(quote => x(new Date(quote.Date)))
    .y(quote => y(quote.SME));

  quotesG
    .append("path")
    .attr("class", "close-avg")
    .attr("d", avgChart(quotes));
};

const drawSlider = () => {
  const slider = createD3RangeSlider(0, 100, "#slider-container");
  slider.range(1, 100);
  slider.onChange(function(newRange) {
    d3.select("#range-label").text(newRange.begin + " - " + newRange.end);
  });
};

const startVisualization = quotes => {
  initChart();
  updateChart(quotes, "Close");
  drawSlider();
};

const main = () => {
  d3.csv("data/nifty_50.csv", parse)
    .then(data => insertSME(data))
    .then(quotes => startVisualization(quotes));
};

window.onload = main;
