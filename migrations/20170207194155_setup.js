"use strict";
const runFile = require('../modules/runSQLFileSync');

exports.up = function (knex, Promise) {
  return runFile(knex, 'migrations/setupStruct.sql');
};

exports.down = function (knex, Promise) {
  let secondary = [];
  secondary.push(knex.schema.dropTable('stage_actions'));
  secondary.push(knex.schema.dropTable('stage_image'));
  secondary.push(knex.schema.dropTable('stage2stage'));
  secondary.push(knex.schema.dropTable('user_item'));
  secondary.push(knex.schema.dropTable('user_quest'));
  return Promise.all(secondary).then(function () {
    let primary = [];
    primary.push(knex.schema.dropTable('stages'));
    primary.push(knex.schema.dropTable('users'));
    primary.push(knex.schema.dropTable('items'));
    return Promise.all(primary);
  }).then(function () {
    return knex.schema.dropTable('quests');
  });
};
