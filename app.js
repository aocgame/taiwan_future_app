const Koa = require("koa");
const app = new Koa();
const env = process.env.NODE_ENV || "development";
const isDev = env === "development";
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const cors = require("koa2-cors");
const index = require("./routes/index");

onerror(app, {
  json: (err, ctx) => {
    const message =
      (isDev || err.expose) && err.message
        ? err.message
        : http.STATUS_CODES[this.status];

    ctx.body = { s: "error", errmsg: message };
  },
});

//cors
app.use(
  cors({
    origin: function(ctx) {
      return "*";
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  // const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());

// app.use(async (ctx, next) => {
//   ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
//   await next();
//  });

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
