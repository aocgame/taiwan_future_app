const Sequelize = require("sequelize");
const BaseTypes = require("sequelize/lib/data-types");
const util = require("util");

const Op = Sequelize.Op;

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  dialect: "mysql",
  port: 3306,
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  //搜索功能的like
  operatorsAliases: { $like: Op.like },
  define: {
    //字符集
    charset: "utf8",
    //时间戳
    timestamps: false,
    dialectOptions: {
      collate: "utf8_general_ci",
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: "+08:00", //东八时区
});

// https://www.liaoxuefeng.com/wiki/1022910821149312/1102265871746784
function defineModel(name, attributes) {
  var attrs = {};
  for (let key in attributes) {
    let value = attributes[key];
    if (typeof value === "object" && value["type"]) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false,
      };
    }
  }
  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeValidate: function(obj) {
        let now = (Date.now() / 1000) | 0;
        if (obj.isNewRecord) {
          if (!obj.id) {
            obj.id = generateId();
          }
          obj.createdAt = now;
          obj.updatedAt = now;
        } else {
          obj.updatedAt = now;
        }
      },
    },
  });
}

// timestamp 类型
var TIMESTAMP = function() {
  if (!(this instanceof TIMESTAMP)) {
    return new TIMESTAMP();
  }

  BaseTypes.ABSTRACT.apply(this, arguments);
};

util.inherits(TIMESTAMP, BaseTypes.ABSTRACT);

TIMESTAMP.prototype.key = TIMESTAMP.key = "TIMESTAMP";

module.exports = {
  sequelize,
  TIMESTAMP,
  Op,
};
