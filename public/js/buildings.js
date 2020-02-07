const showData = function(buildings) {
  const chartAreaElement = document.querySelector(htmlIDs.chartData);
  chartAreaElement.innerHTML = createBuildings(buildings);
};

const drawChart = function(buildings) {
  const nameOfBuildings = buildings.map(building => building.name);
  const heightOfTallestBuildings = getMaxHeight(buildings);
  const chartAreaContainer = d3.select(htmlIDs.chartArea);
  const svg = drawSvg(chartAreaContainer, chartHeight, chartWidth);
  const rectangles = svg.selectAll("rect").data(buildings);
  const newRectangels = rectangles.enter().append("rect");

  const margin = { left: 100, right: 10, top: 10, bottom: 150 };
  const width = chartWidth - (margin.left + margin.right);
  const height = chartHeight - (margin.top + margin.bottom);

  const xScale = d3
    .scaleBand()
    .domain(nameOfBuildings)
    .range([10, svgWidth])
    .padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, heightOfTallestBuildings])
    .range([0, 300]);

  newRectangels
    .attr("y", 0)
    .attr("x", b => xScale(b.name) + 100)
    .attr("width", xScale.bandwidth)
    .attr("height", b => yScale(b.height))
    .attr("fill", "grey");

  const buildingsG = svg
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

  buildingsG
    .append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 3)
    .attr("y", height + 140)
    .text("tall buildings");

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);

  buildingsG
    .append("text")
    .attr("class", "y axis-label")
    .attr("x", -150)
    .attr("y", -40)
    .attr("transform", `rotate (-90)`)
    .text("height (M)");

  buildingsG.append("g").call(yAxis);
  buildingsG
    .append("g")
    .attr("class", "x")
    .attr("transform", `translate (0 , ${height + 62})`)
    .call(xAxis);

  buildingsG
    .selectAll(".x text")
    .attr("transform", `rotate (-40)`)
    .attr("text-anchor", "end");
};

const drawBuildings = function(buildings) {
  showData(buildings);
  drawChart(buildings);
};

const main = function() {
  d3.json("data/buildings.json").then(drawBuildings);
};

window.onload = main;
