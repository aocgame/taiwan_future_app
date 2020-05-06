// 引入刚刚建立连接mysql数据库的db.js文件
const { sequelize } = require("../config/db");
// 引入上一步的数据表模型文件
const ExchangeInfos = sequelize.import("../schema/exchange_infos");
// 自动创建表
// ExchangeInfos.sync({ force: false });

class ExchangeInfosModel {
  static async getAll() {
    return await ExchangeInfos.findAll({
      attributes: ["name", ["symbol", "value"], "desc"],
    });
  }

  static async getInfoByWhere(where, attributes = null) {
    return await ExchangeInfos.findOne({
      where,
      attributes,
    });
  }
}

module.exports = ExchangeInfosModel;
