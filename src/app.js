require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router/index.router");
const mongoConnect = require("./database/index.database");
app.use(express.json());
mongoConnect();

app.use(router);

module.exports = app;
