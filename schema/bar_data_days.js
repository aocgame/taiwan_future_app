module.exports = function(sequelize, DataTypes) {
  let BarData = sequelize.define(
    "bar_data_days",
    {
      date: {
        type: DataTypes.DATEONLY(),
        allowNull: false,
        primaryKey: true,
        field: "date",
        comment: "记录日期",
        defaultValue: false,
      },
      volume: {
        type: DataTypes.MEDIUMINT(8).UNSIGNED,
        allowNull: false,
        field: "volume",
        comment: "成交量",
        defaultValue: 0,
      },
      openPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "open_price",
        comment: "开盘价",
      },
      highPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "high_price",
        comment: "最高价",
      },
      lowPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "low_price",
        comment: "最低价",
      },
      closePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "close_price",
        comment: "收盘价",
      },
    },
    {
      comment: "每日频率数据表",
      engine: "MYISAM",

      // 不用时间
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      paranoid: false,
    }
  );

  return BarData;
};
