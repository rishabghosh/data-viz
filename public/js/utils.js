const toLine = function(building) {
  return `<strong>${building.name}</strong> <i>${building.height}</i>`;
};

const createBuildings = function(buildings) {
  return buildings.map(toLine).join("<hr/>");
};
