"use strict";

const { Op } = require("../models/index");
const BarDataDaysModels = require("../models/index").getModel("bar_data_days");
const moment = require("moment");

class BarDataDays {
  static async getHistory(symbol = "", start = 0, end = 0) {
    return await BarDataDaysModels.findAll({
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

module.exports = BarDataDays;
