"use strict";
const
  runFile=require('../modules/runSQLFileSync');


exports.up = function (knex, Promise) {
  return runFile(knex,'migrations/setupData.sql');
};

exports.down = function (knex, Promise) {

  // Truncate of cause is faster but does not work with FK
  //for faster and unsafe delete, use SET FOREIGN_KEY_CHECKS = 0;
  let secondary = [];
  secondary.push(knex('stage_actions').delete());
  secondary.push(knex('stage_image').delete());
  secondary.push(knex('stage2stage').delete());
  secondary.push(knex('user_item').delete());
  secondary.push(knex('user_quest').delete());
  return Promise.all(secondary).then(function () {
    let primary = [];
    primary.push(knex('stages').delete());
    primary.push(knex('users').delete());
    primary.push(knex('items').delete());
    return Promise.all(primary);
  }).then(function () {
    return knex('quests').delete();
  });
};
