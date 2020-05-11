"use strict";

const errorHandler = (ctx, next) => {
  return next().catch((err, ctx) => {
    console.error("server error", err, ctx);

    if (err.code == null) {
      logger.error(err.stack);
    }
    ctx.body = {
      code: err.code || -1,
      data: null,
      msg: err.message.trim(),
    };

    ctx.status = 200; // 保证返回状态是 200, 这样前端不会抛出异常
    return Promise.resolve();
  });
};

module.exports = {
  errorHandler,
};
