"use strict";

const { TIMESTAMP } = require("./lib/data-types");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "exchange_goods_infos",
    {
      id: {
        type: DataTypes.MEDIUMINT(8).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        comment: "主键",
      },
      exchangeInfoId: {
        type: DataTypes.TINYINT(1).UNSIGNED,
        allowNull: false,
        field: "exchange_info_id",
        comment: "交易所ID",
        defaultValue: 0,
      },
      symbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "symbol",
        comment: "商品代号",
      },
      type: {
        type: DataTypes.ENUM("other", "stock", "index", "future"),
        allowNull: false,
        field: "type",
        comment: "交易商品类型",
      },
      name: {
        type: DataTypes.STRING(50),
        field: "name",
        comment: "注释",
      },
      session: {
        type: DataTypes.CHAR(9),
        allowNull: false,
        field: "session",
        comment: "每日交易时间(HHmm-HHmm)",
      },
      intermission: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "intermission",
        comment: "中场休息时间(HHmm-HHmm,...)",
      },
      minmov: {
        type: DataTypes.MEDIUMINT(8).UNSIGNED,
        allowNull: false,
        field: "minmov",
        comment: "最小波动价格",
        defaultValue: 1,
      },
      pricescale: {
        type: DataTypes.MEDIUMINT(8).UNSIGNED,
        allowNull: false,
        field: "pricescale",
        comment: "价格精度(最小可能价格变动=minmov/pricescale)",
        defaultValue: false,
      },
      minmov2: {
        type: DataTypes.MEDIUMINT(8).UNSIGNED,
        allowNull: false,
        field: "minmov2",
        comment: "价格变动的子精度",
        defaultValue: 0,
      },
      exectimeT1: {
        type: TIMESTAMP,
        field: "exectime_t1",
        comment: "1分钟进度",
        defaultValue: false,
      },
      exectimeH1: {
        type: TIMESTAMP,
        field: "exectime_h1",
        comment: "1小时进度",
        defaultValue: false,
      },
      exectimeD1: {
        type: TIMESTAMP,
        field: "exectime_d1",
        comment: "1天进度",
        defaultValue: false,
      },
      createdAt: {
        type: TIMESTAMP,
        field: "created_at",
        comment: "创建时间",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: TIMESTAMP,
        field: "updated_at",
        defaultValue: sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        comment: "更新时间",
      },
    },
    {
      comment: "交易所信息",
      timestamps: false,

      // 不用时间
      deletedAt: false,
      paranoid: false,
    }
  );
};
