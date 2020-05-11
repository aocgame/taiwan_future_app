"use strict";

const moment = require("moment");
const BarDataDays = require("../services/bar-data-days");
const BarDataTickss = require("../services/bar-data-ticks");
const ExchangeGoodsInfos = require("../services/exchange-goods-infos");
const ExchangeInfos = require("../services/exchange-infos");

class GoodsInfoController {
  /**
   * 商品详情
   * @param {*} ctx
   */
  static async symbols(ctx) {
    // https://b.aitrade.ga/books/tradingview/book/Symbology.html

    // todo http://www.hihubs.com/article/340
    const symbol_attr = ctx.query.symbol.split(":");
    const { length, last = length - 1 } = symbol_attr;
    const goods_info = await ExchangeGoodsInfos.getInfoByWhere(
      { symbol: symbol_attr[last] },
      [
        "exchange_info_id",
        "session",
        "minmov",
        "minmov2",
        "pricescale",
        "type",
        ["name", "description"],
        ["symbol", "name"],
        ["symbol", "ticker"],
      ]
    );

    if (goods_info === null) {
      throw new Error(`unknown_symbol ${ctx.query.symbol}`);
    }

    const exchange_info = await ExchangeInfos.getInfoByWhere(
      { id: goods_info.dataValues.exchange_info_id },
      [["symbol", "exchange-traded"], ["symbol", "exchange-listed"], "timezone"]
    );

    if (exchange_info === null) {
      throw new Error(`unknown_symbol ${ctx.query.symbol}`);
    }

    ctx.body = {
      ticker: "", // 它是您的商品体系中此商品的唯一标识符
      name: "", // 商品名称。您的用户将看到它(作为一个字符串)
      "exchange-traded": "", // listed_exchange 现在，这两个字段都为某个交易所的略称
      "exchange-listed": "",
      description: "", // 描述
      timezone: "", // 时区 UTC
      minmov: 1,
      minmov2: 0,
      pricescale: 100,
      pointvalue: 1,
      session: "1500-1345",
      has_intraday: true, // 布尔值显示商品是否具有日内（分钟）历史数据
      has_no_volume: false,
      type: "", // 仪表的可选类型:stock, index, forex, futures, bitcoin, expression, spread, cfd
      // 这是一个包含日内分辨率(分钟单位)的数组
      supported_resolutions: [
        // "1",
        // "5",
        // "15",
        // "30",
        // "60",
        // "240",
        "1",
        "5",
        "15",
        "30",
        "H",
        "2H",
        "3H",
        "D",
        "2D",
        "3D",
        "W",
        "3W",
        "M",
        "6M",
      ],
      data_status: "endofday", //数据状态(streaming(实时),endofday(已收盘),pulsed(脉冲),delayed_streaming(延迟流动中))
      ...goods_info.dataValues,
      ...exchange_info.dataValues,
    };
  }

  /**
   * 商品标记列表
   * @param {*} ctx
   */
  static marks(ctx) {
    // 替 K 线上加个标记
    ctx.body = {
      id: [
        // 0, 1, 2, 3, 4, 5
      ],
      time: [
        // 1587945600,
        // 1587600000,
        // 1587340800,
        // 1587340800,
        // 1586649600,
        // 1585353600,
      ],
      color: [
        // "red", "blue", "green", "red", "blue", "green"
      ],
      text: [
        // "Today",
        // "4 days back",
        // "7 days back + Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        // "7 days back once again",
        // "15 days back",
        // "30 days back",
      ],
      label: [
        // "A", "B", "CORE", "D", "EURO", "F"
      ],
      labelFontColor: [
        // "white", "white", "red", "#FFFFFF", "white", "#000"
      ],
      minSize: [
        // 14, 28, 7, 40, 7, 14
      ],
    };
  }

  /**
   * 大事件列表
   * @param {*} ctx
   */
  static timescale_marks(ctx) {
    ctx.body = [
      // { id: "tsm1", time: 1587945600, color: "red", label: "A", tooltip: "" },
      // {
      //   id: "tsm2",
      //   time: 1587600000,
      //   color: "blue",
      //   label: "D",
      //   tooltip: ["Dividends: $0.56", "Date: Thu Apr 23 2020"],
      // },
      // {
      //   id: "tsm3",
      //   time: 1587340800,
      //   color: "green",
      //   label: "D",
      //   tooltip: ["Dividends: $3.46", "Date: Mon Apr 20 2020"],
      // },
      // {
      //   id: "tsm4",
      //   time: 1586649600,
      //   color: "#999999",
      //   label: "E",
      //   tooltip: ["Earnings: $3.44", "Estimate: $3.60"],
      // },
      // {
      //   id: "tsm7",
      //   time: 1585353600,
      //   color: "red",
      //   label: "E",
      //   tooltip: ["Earnings: $5.40", "Estimate: $5.00"],
      // },
    ];
  }

  /**
   * 历史数据
   * @param {*} ctx
   */
  static async history(ctx) {
    ctx.body = {
      t: [],
      o: [],
      h: [],
      l: [],
      c: [],
      v: [],
      s: "no_data",
    };

    let resolution = ctx.query.resolution.toUpperCase();
    // 分钟频率
    let is_minutes = !isNaN(resolution);

    let {
      last_time,
      session,
    } = await ExchangeGoodsInfos.getResolutionsUpdatedBySymbol(
      ctx.query.symbol,
      resolution
    );

    if (last_time <= ctx.query.from) {
      // 若是开始时间大于最新时间，或是超出范围，就返回没有数据
      return (ctx.body = {
        s: "no_data",
        nextTime: last_time,
      });
    }

    let data;
    if (is_minutes) {
      data = await BarDataTickss.getHistory(
        ctx.query.symbol,
        resolution,
        ctx.query.from,
        ctx.query.to
      );
    } else {
      let { length, last = length - 1 } = resolution;
      switch (resolution[last]) {
        case "D":
          data = await BarDataDays.getHistory(
            ctx.query.symbol,
            ctx.query.from,
            ctx.query.to
          );
          break;

        default:
          throw new Error("不支持该频率");
      }
    }

    if (data.length) {
      let minutes = ` ${session.substr(0, 2)}:${session.substr(2, 2)}:00`;
      data.map((res) => {
        let dataValue = res.dataValues;
        let datetime = dataValue.date;
        if (is_minutes === true) {
          datetime += " " + dataValue.time;
        } else {
          // 把日线以上的数据调整到开盘时间
          datetime += minutes;
        }
        ctx.body.t.push(moment(datetime).unix());
        ctx.body.o.push(dataValue.openPrice);
        ctx.body.h.push(dataValue.highPrice);
        ctx.body.l.push(dataValue.lowPrice);
        ctx.body.c.push(dataValue.closePrice);
        ctx.body.v.push(dataValue.volume);
      });
      ctx.body.s = "ok";
    }
  }
}

module.exports = GoodsInfoController;
