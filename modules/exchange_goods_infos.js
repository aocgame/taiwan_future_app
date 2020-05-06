// 引入刚刚建立连接mysql数据库的db.js文件
const { sequelize } = require("../config/db");
// 引入上一步的数据表模型文件
const ExchangeGoodsInfos = sequelize.import("../schema/exchange_goods_infos");
// 自动创建表
// ExchangeGoodsInfos.sync({ force: false });
const moment = require("moment");

class ExchangeGoodsInfosModel {
  static async getInfoByWhere(where, attributes = null) {
    return await ExchangeGoodsInfos.findOne({
      where,
      attributes,
    });
  }

  static async getResolutionsUpdatedBySymbol(symbol, resolution) {
    let goods_info = await this.getInfoByWhere({ symbol });
    if (goods_info === null) {
      throw new Error("找不到商品");
    }

    let resolution_transfrom = {
      H: "exectimeH1",
      D: "exectimeD1",
      W: "",
      M: "exectimeM1",
      Y: "exectimeY1",
    };
    let resolution_field = resolution_transfrom[resolution];
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

module.exports = ExchangeGoodsInfosModel;
