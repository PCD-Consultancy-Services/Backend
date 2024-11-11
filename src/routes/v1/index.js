const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const roleRoutes = require("./role.routes");
const permissionRoutes = require("./permission.routes");
const classificationRoutes = require("./classification.routes");
const tankRoutes = require("./tank.routes");
const chemicalRoutes = require("./chemical.routes");
const serviceRoutes = require("./service.routes");
const customerRoutes = require("./customer.routes");
const machineRoutes = require("./machine.routes");
const qualityRoutes = require("./quality.routes");
const masterTemplateRoutes = require("./master-template.routes");
const shadeRoutes = require("./shade.routes");
const recipeRoutes = require("./recipe.routes");
const scheduleRoutes = require("./schedule.routes");
const dispensingRoutes = require("./dispensing.routes");

const defaultRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/role",
    route: roleRoutes,
  },
  {
    path: "/permission",
    route: permissionRoutes,
  },
  {
    path: "/classification",
    route: classificationRoutes,
  },
  {
    path: "/tank",
    route: tankRoutes,
  },
  {
    path: "/chemical",
    route: chemicalRoutes,
  },
  {
    path: "/service",
    route: serviceRoutes,
  },
  {
    path: "/customer",
    route: customerRoutes,
  },
  {
    path: "/machine",
    route: machineRoutes,
  },
  {
    path: "/quality",
    route: qualityRoutes,
  },
  {
    path: "/master-template",
    route: masterTemplateRoutes,
  },
  {
    path: "/shade",
    route: shadeRoutes,
  },
  {
    path: "/recipe",
    route: recipeRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/dispensing",
    route: dispensingRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
