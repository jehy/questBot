var fsp = require('fs-promise');
exports.up = function (knex, Promise) {
  return fsp.readFile('migrations/setupStruct.sql', {encoding: 'utf8'}).then(function (sqlData) {
    sqlData = (sqlData.trim());
    var arr = sqlData.split(";\r\n");
    var creates = [];
    for (var i = 0; i < arr.length; i++) {
      creates.push(knex.schema.raw(arr[i]));
    }
    return Promise.all(creates);
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('stage_actions').then(function () {
    return knex.schema.dropTable('stage_image');
  }).then(function () {
    return knex.schema.dropTable('stage2stage');
  }).then(function () {
    return knex.schema.dropTable('user_item');
  }).then(function () {
    return knex.schema.dropTable('user_quest');
  }).then(function () {
    return knex.schema.dropTable('stages');
  }).then(function () {
    return knex.schema.dropTable('users');
  }).then(function () {
    return knex.schema.dropTable('items');
  }).then(function () {
    return knex.schema.dropTable('quests');
  });
};
