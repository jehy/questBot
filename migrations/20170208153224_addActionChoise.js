exports.up = function (knex, Promise) {
  return knex.schema.table('stage_actions', table=> {
    table.integer('choice').defaultTo(0)
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('stage_actions', table=> {
    table.dropColumn('choice')
  });
};
