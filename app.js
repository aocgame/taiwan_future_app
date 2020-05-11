"use strict";

global.__basedir = __dirname;

const env = process.env.NODE_ENV || "development";
const isDev = env === "development";

const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const cors = require("koa2-cors");

const Koa = require("koa");
const app = new Koa();

const { errorHandler } = require("./middlewares/response");
const { loggerMiddleware } = require("./middlewares/logger");
const { corsHandler } = require("./middlewares/cors");
const index = require("./routes/index");

/**
 * TODO 开发环境与生产环境的进程 https://jinlong.github.io/2013/10/17/7-tips-for-a-node-dot-js-padawan/
 *    https://medium.com/@samtsai15/node-js-%E5%BE%9E-nodemon-%E4%B8%8A%E7%B7%9A%E5%88%B0-pm2-%E6%99%82%E9%81%87%E5%88%B0%E7%9A%84%E5%B0%8F%E5%9D%91-42a573cff35e
 * TODO https://github.com/node-schedule/node-schedule
 */

onerror(app, {
  json: (err, ctx) => {
    const message =
      (isDev || err.expose) && err.message
        ? err.message
        : http.STATUS_CODES[this.status];

    ctx.body = { s: "error", errmsg: message };
  },
});

// Global Middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);

// Cors
app.use(cors(corsHandler));

app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// Logger
app.use(loggerMiddleware);

// routes
app.use(index.routes(), index.allowedMethods());

// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
//   await next();
//  });

// Error Handler
app.use(errorHandler);

module.exports = app;
