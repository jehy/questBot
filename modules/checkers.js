'use strict';

function CheckersInit(bot, knex) {

  this.knex = knex;
  this.bot = bot;
}

/**
 * Check if user has this item in this quest
 * @param msg {Object}
 * @param questId {int}
 * @param extra{Object}
 */
CheckersInit.prototype.itemExists = function (msg, questId, extra) {
  var chatId = msg.from.id;
  var self = this;
  var searchId = this.knex('users').where({
    telegram_id: chatId
  }).first('id')
    .then(function (data) {
      return self.knex('user_item').where({user_id: data.id, quest_id: questId, item_id: extra.id}).first('id')
    });
  return searchId.then(function (dummy) {
    if (dummy === undefined)
      return 0;
    return 1;
  })
};


/**
 * Check if user has no specific item in this quest
 * @param msg {Object}
 * @param questId {int}
 * @param extra{Object}
 */
CheckersInit.prototype.itemNotExists = function (msg, questId, extra) {
  return this.itemExists(msg, questId, extra).then(function (exists) {
    if (exists === 1)
      return 0;
    return 1;
  });
};


CheckersInit.prototype.check = function (questId, name, msg, extra) {

  switch (name) {
    case'itemNotExists':
      return this.itemNotExists(msg, questId, extra);
      break;
    case'itemExists':
      return this.itemExists(msg, questId, extra);
      break;
    default:
      throw new Error('checker ' + name + ' does not exist!');
  }
};
module.exports = CheckersInit;