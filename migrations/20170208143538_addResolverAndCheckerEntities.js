exports.up = function (knex, Promise) {
  let schemaBuilder = knex.schema;
  schemaBuilder.createTable('resolvers', function (table) {
    table.increments();
    table.string('name');
    table.string('description');
  });
  schemaBuilder.createTable('checkers', function (table) {
    table.increments();
    table.string('name');
    table.string('description');
  });
  return schemaBuilder.then(()=> {
    let p1 = knex('checkers').insert([{name: 'itemExists', 'description': 'проверить наличие предмета'}, {
      name: 'itemNotExists',
      'description': 'проверить отсутствие предмета'
    }]);
    let p2 = knex('resolvers').insert([
      {name: 'setGender', 'description': 'Выставить пол пользователю и вернуть значение пола'}, {
        name: 'takeItem',
        'description': 'Взять предмет'
      }, {
        name: 'checkGender',
        'description': 'Вернуть значение пола пользователя'
      }, {
        name: 'die',
        'description': 'Умереть, потерять все предметы и вернуться в начало'
      }, {
        name: 'playDice',
        'description': 'Сыграть в кости'
      }, {
        name: 'finish',
        'description': 'Успешно закончить квест и потерять все его предметы'
      }, {
        name: 'takeItem',
        'description': 'Взять предмет'
      }]);
    return Promise.all([p1, p2]);
  })
    .then(()=> {
      return knex.schema.raw(`UPDATE stage_actions
      INNER JOIN resolvers ON stage_actions.resolver = resolvers.name
      SET stage_actions.resolver = resolvers.id`)
    })
    .then(()=> {
      return knex.schema.raw(`UPDATE stage_actions
      INNER JOIN checkers ON stage_actions.checker = checkers.name
      SET stage_actions.checker = checkers.id`)
    })
    .then(()=> {
      return knex.schema.raw(`ALTER TABLE \`stage_actions\`   
  CHANGE \`resolver\` \`resolver\` INT UNSIGNED NULL,
  CHANGE \`checker\` \`checker\` INT UNSIGNED NULL,
  ADD CONSTRAINT \`stage_actions_checker\` FOREIGN KEY (\`checker\`) REFERENCES \`checkers\`(\`id\`),
  ADD CONSTRAINT \`stage_actions_resolver\` FOREIGN KEY (\`resolver\`) REFERENCES \`resolvers\`(\`id\`);`)
    })
};

exports.down = function (knex, Promise) {
  console.log('That is not a full down migration!');
  let action = [];
  action.push(knex.schema.dropTable('resolvers'));
  action.push(knex.schema.dropTable('checkers'));
  return Promise.all(action);
};
