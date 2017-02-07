"use strict";
const runPromiseQueue = require('../modules/promiseQueue'),
      fsp             = require('fs-promise');


const runFile = function (knex, fileName) {
  return fsp.readFile(fileName, {encoding: 'utf8'})
    .then(function (sqlData) {
      sqlData = (sqlData.trim());
      let arr = sqlData.split(";\r\n");
      let inserts = [];
      for (let i = 0; i < arr.length; i++) {
        inserts.push(function () {
          return knex.schema.raw(arr[i])
        });
      }
      return runPromiseQueue(inserts);
    });
};
module.exports = runFile;