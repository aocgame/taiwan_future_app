"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config");

const Op = Sequelize.Op;

const sequelize = new Sequelize(null, null, null, {
  dialect: "mysql",
  host: config.mysqlDB.host,
  port: config.mysqlDB.port,
  database: config.mysqlDB.database,
  username: config.mysqlDB.username,
  password: config.mysqlDB.password,
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
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
// function defineModel(name, attributes) {
//   var attrs = {};
//   for (let key in attributes) {
//     let value = attributes[key];
//     if (typeof value === "object" && value["type"]) {
//       value.allowNull = value.allowNull || false;
//       attrs[key] = value;
//     } else {
//       attrs[key] = {
//         type: value,
//         allowNull: false,
//       };
//     }
//   }
//   return sequelize.define(name, attrs, {
//     tableName: name,
//     timestamps: false,
//     hooks: {
//       beforeValidate: function(obj) {
//         let now = (Date.now() / 1000) | 0;
//         if (obj.isNewRecord) {
//           if (!obj.id) {
//             obj.id = generateId();
//           }
//           obj.createdAt = now;
//           obj.updatedAt = now;
//         } else {
//           obj.updatedAt = now;
//         }
//       },
//     },
//   });
// }

let db = {
  sequelize,
  Op,
  models: {},
};

// 整合models文件下的其他js文件
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== "index.js" && file !== "lib";
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db.models[model.tableName] = model;
  });
// 根据name选择model
db.getModel = function(name) {
  return this.models[name];
};

module.exports = db;
