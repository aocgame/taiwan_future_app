"use strict";

const path = require("path");

module.exports = {
  port: "3000",
  // secret: "secret",
  // publicDir: path.resolve(__dirname, "./public"),
  // logPath: path.resolve(__dirname, "./logs/koa-template.log"),
  mysqlDB: {
    host: "127.0.0.1",
    port: 3306,
    database: "stock",
    username: "root",
    password: "",
  },
};
