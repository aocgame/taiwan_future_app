"use strict";

const ExchangeGoodsInfosModels = require("../models/index").getModel(
  "exchange_goods_infos"
);
const moment = require("moment");

class ExchangeGoodsInfos {
  static async getInfoByWhere(where, attributes = null) {
    return await ExchangeGoodsInfosModels.findOne({
      where,
      attributes,
    });
  }

  static async getResolutionsUpdatedBySymbol(symbol, resolution) {
    let goods_info = await this.getInfoByWhere({ symbol });
    if (goods_info === null) {
      throw new Error("找不到商品");
    }

    let resolution_field;
    if (isNaN(resolution)) {
      // 非分钟频率
      let map = {
        H: "exectimeH1",
        D: "exectimeD1",
      };
      let { length, last = length - 1 } = resolution;
      resolution_field = map[resolution[last]];
    }
    if (!resolution_field) {
      resolution_field = "exectimeT1";
    }
    return {
      last_time: moment(goods_info.dataValues[resolution_field])
        .subtract(moment().utcOffset(), "minute")
        .unix(),
      session: goods_info.dataValues.session,
    };
  }
}

module.exports = ExchangeGoodsInfos;
