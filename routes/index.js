"use strict";

const router = require("koa-router")();

const ConfigController = require("../controllers/config");
router.get("/config", ConfigController.config);
router.get("/time", ConfigController.time);

const GoodsInfoController = require("../controllers/goods-info");
router.get("/symbols", GoodsInfoController.symbols);
router.get("/marks", GoodsInfoController.marks);
router.get("/timescale_marks", GoodsInfoController.timescale_marks);
router.get("/history", GoodsInfoController.history);

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "many money",
  });
});

module.exports = router;
