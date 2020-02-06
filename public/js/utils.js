const toLine = function(building) {
  return `<strong>${building.name}</strong> <i>${building.height}</i>`;
};

const createBuildings = function(buildings) {
  return buildings.map(toLine).join("<hr/>");
};

const getMaxHeight = function(buildings) {
  return _.maxBy(buildings, "height").height;
};

const drawSvg = function(svgContainer, height, width) {
  return svgContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height);
};
