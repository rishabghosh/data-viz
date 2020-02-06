const drawBuildings = buildings => {
  const chartAreaElement = document.querySelector(htmlIDs.chartArea);
  chartAreaElement.innerHTML = createBuildings(buildings);
  const chartAreaContainer = d3.select(htmlIDs.chartArea);

  const svg = chartAreaContainer
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const rectangles = svg.selectAll("rect").data(buildings);
  const newRectangels = rectangles.enter().append("rect");
  console.log(newRectangels);

  const nameOfBuildings = buildings.map(building => building.name);
  console.log(nameOfBuildings);

  const xScale = d3
    .scaleBand()
    .domain([nameOfBuildings])
    .range([0, svgWidth])
    .padding("inner", 0.3)
    .padding("outer", 0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, 828])
    .range([0, 400]);
  console.log("yScale", yScale);

  newRectangels
    .attr("y", 0)
    .attr("x", (b, index) => index * 60)
    .attr("width", 40)
    .attr("height", b => yScale(b.height))
    .attr("fill", "grey");
};

const main = () => {
  d3.json("data/buildings.json").then(drawBuildings);
};

window.onload = main;
