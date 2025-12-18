const express = require("express");
const mainRoute = express.Router(); // ✅ Router use karo

mainRoute.use("/country", require("./country.route"));
mainRoute.use("/language", require("./language.route"));
mainRoute.use("/dropdown", require("./dropdown.route"));
// mainRoute.use("/category", require("./category.route"));

module.exports = mainRoute; 
