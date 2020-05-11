"use strict";

const { Op } = require("../models/index");
const BarDataTicksModels = require("../models/index").getModel(
  "bar_data_ticks"
);
const moment = require("moment");

class BarDataTicks {
  static async getHistory(symbol = "", interval = 1, start = 0, end = 0) {
    let start_date = moment.unix(start).format("YYYY-MM-DD");
    let start_time = moment.unix(start).format("HH:mm:ss");
    let end_date = moment.unix(end).format("YYYY-MM-DD");
    let end_time = moment.unix(end).format("HH:mm:ss");
    let where = [];
    if (start_date == end_date) {
      where = [
        {
          date: start_date,
          time: {
            [Op.gte]: start_time,
            [Op.lte]: end_time,
          },
          interval,
        },
      ];
    } else {
      where = {
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
        interval,
      };
    }
    return await BarDataTicksModels.findAll({ where });
  }

  //   static async createDetaillist(data) {
  //     return await Detaillist.create({
  //       id: data.id,
  //       title: data.title,
  //     });
  //   }
}

module.exports = BarDataTicks;
