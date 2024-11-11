const consumptionUnits = ["GPL"];
const phUnits = ["PPM"];
const densityUnits = ["KG"];
const conductivityUnits = ["MS/CM"];
const viscosityUnits = ["MPAS"];
const ratioUnits = ["g/l", "%"];

const productCategories = [
  "N6",
  "N66",
  "N6HT",
  "N66HT",
  "POLY",
  "POLHT",
  "RPOL",
  "N6POY",
  "POLMT",
];
const processes = ["HIM", "LIM", "SIM", "NIM", "TW", "HB", "TWHK", "PCT"];
const lustres = ["SD", "BR", "FD"];
const qualities = ["1ST", "PQ", "CLQ", "SS", "JL", "IE", "1W1", "1W2", "1W3"];
const shadePrefixes = ["RW", "D", "DD"];
const denierPrefix = "D";
const filamentPrefix = "F";
const plyPrefix = "P";
const lubricated = "LUB";

const recipeTypes = ["Lab", "Production", "Modification"];
const cardBatches = ["EP", "LP", "LN", "EN", "SP", "SN"];
module.exports = {
  consumptionUnits,
  phUnits,
  densityUnits,
  conductivityUnits,
  viscosityUnits,
  ratioUnits,
  productCategories,
  processes,
  lustres,
  qualities,
  shadePrefixes,
  denierPrefix,
  filamentPrefix,
  plyPrefix,
  lubricated,
  recipeTypes,
  cardBatches,
};
