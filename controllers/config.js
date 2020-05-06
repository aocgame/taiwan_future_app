const ExchangeInfosModel = require("../modules/exchange_infos");

class ConfigController {
  static async config(ctx) {
    ctx.body = {
      supports_search: true,
      supports_group_request: false,
      supports_marks: true,
      supports_timescale_marks: true,
      supports_time: true,
      exchanges: [
        { value: "", name: "所有交易市场", desc: "" },
        ...(await ExchangeInfosModel.getAll()),
      ],
      symbols_types: [
        { value: "", name: "所有种类" },
        // { value: "stock", name: "股票" },
        // { value: "index", name: "指数" },
        { value: "future", name: "期货" },
      ],
      supported_resolutions: [
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
    };
  }

  static time(ctx) {
    ctx.body = (Date.now() / 1000) | 0;
  }
}

module.exports = ConfigController;
