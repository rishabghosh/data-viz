const drawBuildings = buildings => {
  const nameOfBuildings = buildings.map(building => building.name);
  const heightOfTallestBuildings = getMaxHeight(buildings);
  const chartAreaElement = document.querySelector(htmlIDs.chartArea);

  chartAreaElement.innerHTML = createBuildings(buildings);
  const chartAreaContainer = d3.select(htmlIDs.chartArea);

  const svg = drawSvg(chartAreaContainer, svgHeight, svgWidth);
  const rectangles = svg.selectAll("rect").data(buildings);
  const newRectangels = rectangles.enter().append("rect");

  const xScale = d3
    .scaleBand()
    .domain(nameOfBuildings)
    .range([0, svgWidth])
    .padding(0.3);

  yScale = d3
    .scaleLinear()
    .domain([0, heightOfTallestBuildings])
    .range([0, 400]);

  newRectangels
    .attr("y", 0)
    .attr("x", b => xScale(b.name))
    .attr("width", xScale.bandwidth)
    .attr("height", b => yScale(b.height))
    .attr("fill", "grey");
};

const main = () => {
  d3.json("data/buildings.json").then(drawBuildings);
};

window.onload = main;
