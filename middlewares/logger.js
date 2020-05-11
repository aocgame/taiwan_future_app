"use strict";

const loggerMiddleware = async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  // const rt = ctx.response.get("X-Response-Time");
  // console.log(`--> ${ctx.method} ${ctx.url} - ${ms}ms`);
};

module.exports = {
  loggerMiddleware,
};
