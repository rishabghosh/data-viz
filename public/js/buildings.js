const drawBuildings = buildings => {
  const chartAreaElement = document.querySelector("#chart-area");
  chartAreaElement.innerHTML = createBuildings(buildings);

  const container = d3.select("#chart-area");
  const svg = container
    .append("svg")
    .attr("width", 400)
    .attr("height", 400);

  const rectangles = svg.selectAll("rect").data(buildings);
  const newRectangels = rectangles.enter().append("rect");
  console.log(newRectangels);

  newRectangels
    .attr("y", 0)
    .attr("x", 60)
    .attr("width", 40)
    .attr("height", 100)
    .attr("fill", "grey");
};

const main = () => {
  d3.json("data/buildings.json").then(drawBuildings);
};
window.onload = main;
