exports.up = function (knex, Promise) {
  let schemaBuilder = knex.schema;
  schemaBuilder.table('stage_actions', table => table.renameColumn('module', 'resolver'));
  schemaBuilder.table('stage_actions', table => table.renameColumn('extra_id', 'resolver_extra_id'));
  return schemaBuilder;
};

exports.down = function (knex, Promise) {
  let schemaBuilder = knex.schema;
  schemaBuilder.table('stage_actions', table => table.renameColumn('resolver', 'module'));
  schemaBuilder.table('stage_actions', table => table.renameColumn('resolver_extra_id', 'extra_id'));
  return schemaBuilder;
};
