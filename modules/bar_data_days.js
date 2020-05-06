// 引入刚刚建立连接mysql数据库的db.js文件
const { sequelize, Op } = require("../config/db");
// 引入上一步的数据表模型文件
const BarDataDays = sequelize.import("../schema/bar_data_days");
// 自动创建表
// BarDatalist.sync({ force: false });
const moment = require("moment");

class BarDataDaysModel {
  static async getHistory(symbol = "", start = 0, end = 0) {
    return await BarDataDays.findAll({
      where: {
        date: {
          [Op.lte]: moment.unix(end).format("YYYY-MM-DD"),
          [Op.gte]: moment.unix(start).format("YYYY-MM-DD"),
        },
      },
    });
  }

  //   static async createDetaillist(data) {
  //     return await Detaillist.create({
  //       id: data.id,
  //       title: data.title,
  //     });
  //   }
}

module.exports = BarDataDaysModel;
