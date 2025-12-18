const express = require("express");
const dropdownRoute = express.Router();
const dropdownController = require("../controller/dropdown.controller");

dropdownRoute.get("/country", dropdownController.country);
dropdownRoute.get("/language", dropdownController.language);

module.exports = dropdownRoute;