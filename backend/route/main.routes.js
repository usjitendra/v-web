const express = require("express");
const mainRoutes = express(); // define our app using express


mainRoutes.use("/language", require("./language.route"));



express.exports = mainRoutes;