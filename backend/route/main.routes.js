const express = require("express");
const mainRoute = express.Router();

mainRoute.use("/country", require("./country.route"));
mainRoute.use("/language", require("./language.route"));
mainRoute.use("/category", require("./category.route"));
mainRoute.use("/subcategory", require("./subcategory.route"));
mainRoute.use("/dropdown", require("./dropdown.route"));
mainRoute.use("/doctor", require("./doctor.route"));
mainRoute.use("/hospital", require("./hospital.route"));
mainRoute.use("/booking", require("../routes/bookings.cjs"));

// mainRoute.use("/dashboard-doctor", require("./hospital.route"));


module.exports = mainRoute; 
