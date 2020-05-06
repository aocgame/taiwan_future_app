const { TIMESTAMP } = require("../config/db");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "exchange_infos",
    {
      id: {
        type: DataTypes.TINYINT(1).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        comment: "主键",
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "name",
        comment: "交易所名称",
      },
      symbol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "symbol",
        comment: "交易所代号",
      },
      desc: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "desc",
        comment: "描述",
      },
      timezone: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "timezone",
        comment: "时区",
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
