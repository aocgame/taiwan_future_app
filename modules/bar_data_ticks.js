// 引入刚刚建立连接mysql数据库的db.js文件
const { sequelize, Op } = require("../config/db");
// 引入上一步的数据表模型文件
const BarDataTicks = sequelize.import("../schema/bar_data_ticks");
// 自动创建表
// BarDatalist.sync({ force: false });
const moment = require("moment");

class BarDataTicksModel {
  static async getHistory(symbol = "", start = 0, end = 0) {
    let start_date = moment.unix(start).format("YYYY-MM-DD");
    let end_date = moment.unix(end).format("YYYY-MM-DD");
    let start_time = moment.unix(start).format("HH:mm:ss");
    let end_time = moment.unix(end).format("HH:mm:ss");
    return await BarDataTicks.findAll({
      where: {
        [Op.or]: [
          {
            date: start_date,
            time: {
              [Op.gte]: start_time,
            },
          },
          {
            date: {
              [Op.gt]: start_date,
              [Op.lt]: end_date,
            },
          },
          {
            date: end_date,
            time: {
              [Op.lte]: end_time,
            },
          },
        ],
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

module.exports = BarDataTicksModel;
