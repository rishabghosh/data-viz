const toLine = function(company, info) {
  return `<strong>${company.Name}</strong> <i>${company[info]}</i>`;
};

const createCompanies = function(companies, info) {
  return companies.map(company => toLine(company, info)).join("<hr/>");
};

const getMax = function(companies, info) {
  return _.maxBy(companies, info)[info];
};

const drawSvg = function(svgContainer, height, width) {
  return svgContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height);
};

const showData = function(companies, info) {
  const chartAreaElement = document.querySelector(htmlIDs.chartData);
  chartAreaElement.innerHTML = createCompanies(companies, info);
};

const drawChart = function(companies, info) {
  const nameOfcompanies = companies.map(building => building.Name);
  const maxBarOnChart = getMax(companies, info);
  const chartAreaContainer = d3.select(htmlIDs.chartArea);
  const svg = drawSvg(chartAreaContainer, chartHeight, chartWidth);
  const rectangles = svg.selectAll("rect").data(companies);
  const newRectangels = rectangles.enter().append("rect");

  const axisMargin = { left: 100, right: 10, top: 10, bottom: 150 };
  const width = chartWidth - (axisMargin.left + axisMargin.right);
  const height = chartHeight - (axisMargin.top + axisMargin.bottom);

  const xScale = d3
    .scaleBand()
    .domain(nameOfcompanies)
    .range([30, svgWidth])
    .padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxBarOnChart])
    .range([320, 0]);

  newRectangels
    .attr("y", b => yScale(+b[info]))
    .attr("x", b => {
      return xScale(b.Name) + 90;
    })
    .attr("width", xScale.bandwidth)
    .attr("height", b => {
      const endValue = +b[info];
      const endYScale = yScale(endValue);
      const startYScale = yScale(0);
      const height = startYScale - endYScale;
      return height;
    })
    .attr("fill", "grey");

  const companiesG = svg
    .append("g")
    .attr("transform", `translate(${axisMargin.left} ${axisMargin.top})`);

  companiesG
    .append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 3)
    .attr("y", height + 140)
    .text("companies");

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);

  companiesG
    .append("text")
    .attr("class", "y axis-label")
    .attr("x", -150)
    .attr("y", -40)
    .attr("transform", `rotate (-90)`)
    .text(info);

  companiesG.append("g").call(yAxis);
  companiesG
    .append("g")
    .attr("class", "x")
    .attr("transform", `translate (-10 , ${height + 70})`)
    .call(xAxis);

  companiesG
    .selectAll(".x text")
    .attr("transform", `rotate (-40)`)
    .attr("text-anchor", "end");
};

const updateCompanies = function(companies, fieldName) {
  const svg = d3.select("#chart-area svg");
  svg.select(".y.axis-label").text(fieldName);
  y = d3
    .scaleLinear()
    .domain([_.maxBy(companies, fieldName)[fieldName], 0])
    .range([0, chartHeight]);
  const yAxis = d3
    .axisLeft(y)
    .tickFormat(d => d)
    .ticks(4);
  svg.select(".y.axis").call(yAxis);
  svg
    .selectAll("rect")
    .data(companies)
    .transition()
    .duration(1000)
    .attr("y", c => y(c[fieldName]))
    .attr("height", c => y(0) - y(c[fieldName]));
};

const removePreviousData = function() {
  const chartAreaElement = document.querySelector(htmlIDs.chartArea);
  console.log(chartAreaElement);
  if (chartAreaElement !== null) {
    chartAreaElement.innerHTML = "";
  }
};

const cycle = function(data, callback, collection) {
  collection.forEach((info, index) =>
    setTimeout(() => {
      callback(data, info, index);
    }, 2000 * (index + 1))
  );
  const totalTimeEachLoop = collection.length * 2000;
  setTimeout(() => {
    cycle(data, callback, collection);
  }, totalTimeEachLoop);
};

const main = function() {
  d3.csv("data/company.csv").then(d => {
    const allAttributes = Object.keys(d[0]);
    allAttributes.shift();
    const firstAttribute = allAttributes.shift();
    showData(d, firstAttribute);
    drawChart(d, firstAttribute);
    cycle(d, updateCompanies, allAttributes);
  });
};

window.onload = main;
