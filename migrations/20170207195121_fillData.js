var fsp = require('fs-promise');


exports.up = function (knex, Promise) {
  return fsp.readFile('migrations/setupData.sql', {encoding: 'utf8'})
    .then(function (sqlData) {
      sqlData = (sqlData.trim());
      var arr = sqlData.split(";\r\n");
      var inserts = [];
      for (var i = 0; i < arr.length; i++) {
        inserts.push(knex.schema.raw(arr[i]));
      }
      return Promise.all(inserts);
    })
};

exports.down = function (knex) {
  return knex.raw('SET FOREIGN_KEY_CHECKS = 0;').then(function () {
    return knex('stage_actions').truncate()
  })
    .then(function () {
      return knex('stage_image').truncate();
    }).then(function () {
    return knex('stage2stage').truncate();
  }).then(function () {
    return knex('user_item').truncate();
  }).then(function () {
    return knex('user_quest').truncate();
  }).then(function () {
    return knex('items').truncate();
  }).then(function () {
    return knex('quests').truncate();
  }).then(function () {
    return knex('stages').truncate();
  }).then(function () {
    return knex('users').truncate();
  }).then(function () {
    return knex.raw('SET FOREIGN_KEY_CHECKS = 1;')
  });
};
