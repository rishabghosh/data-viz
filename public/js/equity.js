const chartSize = { width: 800, height: 600 };
const margin = { left: 100, right: 10, top: 20, bottom: 150 };
const width = chartSize.width - margin.left - margin.right;
const height = chartSize.height - margin.top - margin.bottom;

const Rs = d => `${d} ₹`;
const kCrRs = d => `${d / 1000}k Cr ₹`;
const Percent = d => `${d}%`;

const fieldFormat = {
  CMP: Rs,
  MarketCap: kCrRs,
  DivYld: Percent,
  ROCE: Percent,
  QNetProfit: kCrRs,
  QSales: kCrRs
};

const formatCSV = function(data) {
  const format = {
    Date: "date",
    Open: "open",
    High: "high",
    Low: "low",
    Close: "close",
    AdjClose: "adjClose",
    Volume: "volume"
  };
};

const getCloseData = companies => companies.Close;

const slow = () =>
  d3
    .transition()
    .duration(500)
    .ease(d3.easeLinear);

const updateChart = (quotes, fieldName) => {
  const format = fieldFormat[fieldName];
  const svg = d3.select("#chart-area svg");
  const maxDomain = _.get(_.maxBy(quotes, fieldName), fieldName, 0);

  const dates = quotes.map(data => data.Date);

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

  const lines = d3
    .line()
    .x(quotes => x(new Date(quotes.Date)))
    .y(quotes => y(quotes[fieldName]));

  const quotesG = svg.select(".companies");
  quotesG
    .append("path")
    .attr("class", "close")
    .attr("d", lines(quotes))
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", "1px");
};

const initChart = () => {
  const svg = d3
    .select("#chart-area svg")
    .attr("height", chartSize.height)
    .attr("width", chartSize.width);

  const g = svg
    .append("g")
    .attr("class", "companies")
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

const parseCompany = ({ Date, Volume, AdjClose, ...rest }) => {
  _.forEach(rest, (v, k) => (rest[k] = +v));
  return { Date, ...rest };
};

const frequentlyMoveCompanies = (src, dest) => {
  setInterval(() => {
    const c = src.shift();
    if (c) dest.push(c);
    else [src, dest] = [dest, src];
  }, 2000);
};

const startVisualization = quotes => {
  const nextName = (() => {
    let step = 0;
    return () => quotes[step++ % quotes.length];
  })();

  initChart();
  updateChart(quotes, nextName());
  setInterval(() => updateChart(quotes, nextName()), 1000);
  frequentlyMoveCompanies(quotes, []);
};

const main = () => {
  d3.csv("data/nifty_50.csv", parseCompany).then(data => {
    initChart();
    updateChart(data, "Close");
  });
};

window.onload = main;
