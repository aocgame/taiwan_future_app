"use strict";

const ExchangeInfosModels = require("../models/index").getModel(
  "exchange_infos"
);

class ExchangeInfos {
  static async getAll() {
    return await ExchangeInfosModels.findAll({
      attributes: ["name", ["symbol", "value"], "desc"],
    });
  }

  static async getInfoByWhere(where, attributes = null) {
    return await ExchangeInfosModels.findOne({
      where,
      attributes,
    });
  }
}

module.exports = ExchangeInfos;
