/** @format */

const mongoose = require("mongoose");
const { dbHost, dbPass, dbName, dbPort, dbUser } = require("../app/config");

mongoose.connect(`mongodb+srv://resiwicaksono:thonkwaq123@cluster0.a3dlh.mongodb.net/wakburgerbar?retryWrites=true&w=majority`);
const db = mongoose.connection;

module.exports = db;
