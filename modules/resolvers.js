'use strict';
var Promise = require('bluebird');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Resolvers(bot, knex) {

  this.knex = knex;
  this.bot = bot;
}

/**
 * saves user gender and returns choice value
 * @param msg
 * @returns {int} 1 for male, 2 for female
 */
Resolvers.prototype.setGender = function (msg) {
  var chatId = msg.from.id;
  var gender = msg.text.toLowerCase();
  var data = 'M';
  if (gender === 'женщина') {
    data = 'F';
  }
  return this.knex('users').where('telegram_id', chatId).update({"gender": data}).then(function () {
    console.log('gender set');
    if (data === 'M')
      return 1;
    return 2;
  });
};

/**
 * saves just die
 * @param msg {Object}
 * @param questId {int}
 * @param extra{Object}
 * @returns {int} 0
 */
Resolvers.prototype.die = function (msg, questId, extra) {
  console.log("Cleaning up user items");
  var chatId = msg.from.id;
  var self = this;
  return this.knex('users').where({
    telegram_id: chatId
  }).first('id')
    .then(function (data) {//take item
      return self.knex('user_item').where({user_id: data.id, quest_id: questId}).delete().then(function () {
        return 0;
      })
    })
};


/**
 * saves remove all items and mark quest as finished
 * @param msg {Object}
 * @param questId {int}
 * @param extra{Object}
 * @returns {int} 0
 */
Resolvers.prototype.finish = function (msg, questId, extra) {
  console.log("Cleaning up user items");
  var chatId = msg.from.id;
  var self = this;
  return this.knex('users').where({
    telegram_id: chatId
  }).first('id')
    .then(function (data) {//take item
      return self.knex('user_item').where({user_id: data.id, quest_id: questId}).delete().then(function () {
        return self.knex('user_quest').where({
          user_id: data.id,
          quest_id: questId
        }).update({completed: 1}).then(function () {
          return 0;
        });
      })
    })
};
/**
 * check user gender
 * @param msg
 * @returns {int} 1 for male, 2 for female
 */
Resolvers.prototype.checkGender = function (msg) {
  var chatId = msg.from.id;
  return this.knex('users').where('telegram_id', chatId).first("gender").then(function (data) {
    if (data.gender === 'M')
      return 1;
    return 2;
  });
};
/**
 * Take an item
 * @param msg {Object}
 * @param questId {int}
 * @param extra{Object}
 * @returns {int} -1 we just take an item
 */
Resolvers.prototype.takeItem = function (msg, questId, extra) {
  var chatId = msg.from.id;
  var self = this;
  return this.knex('users').where({
    telegram_id: chatId
  }).first('id')
    .then(function (data) {//take item
      return self.knex('user_item').insert({user_id: data.id, item_id: extra.id, quest_id: questId})
    })
    .then(function () {//get item name
      return self.knex('items').where({id: extra.id}).first();
    })
    .then(function (data) {//send message to user
      console.log('took item ' + data.name);
      self.bot.sendMessage(chatId, "Вы взяли предмет: " + data.name);
      return -1;
    });
};


/**
 * Take an item
 * @param msg {Object}
 * @param questId {int}
 * @param extra{Object}
 * @returns {int} -1 we just take an item
 */
Resolvers.prototype.playDice = function (msg, questId, extra) {
  var chatId = msg.from.id;
  var self = this;
  var playerWins = 0;
  var DemonWins = 0;
  self.bot.sendMessage(chatId, "Тяжело дыша, вы бросаете кости на пол");
  return Promise
    .delay(1000).then(function () {
      var playerAttempt = getRandomInt(1, 12);
      var versusAttempt = getRandomInt(1, 12);
      self.bot.sendMessage(chatId, "Ваш бросок: " + playerAttempt);
      self.bot.sendMessage(chatId, "Бросок демона: " + versusAttempt);
      if (playerAttempt > versusAttempt)playerWins++;
      else DemonWins++;
    })
    .delay(2000).then(function () {
      var playerAttempt = getRandomInt(1, 12);
      var versusAttempt = getRandomInt(1, 12);
      self.bot.sendMessage(chatId, "Ваш бросок: " + playerAttempt);
      self.bot.sendMessage(chatId, "Бросок демона: " + versusAttempt);
      if (playerAttempt > versusAttempt)playerWins++;
      else DemonWins++;
    })
    .delay(2000).then(function () {
      var playerAttempt = getRandomInt(1, 12);
      var versusAttempt = getRandomInt(1, 12);
      self.bot.sendMessage(chatId, "Ваш бросок: " + playerAttempt);
      self.bot.sendMessage(chatId, "Бросок демона: " + versusAttempt);
      if (playerAttempt > versusAttempt)
        playerWins++;
      else
        DemonWins++;
      if (playerWins > DemonWins) {
        self.bot.sendMessage(chatId, "Вы выигрываете " + playerWins + ":" + DemonWins);
        return 1;
      }
      else {
        self.bot.sendMessage(chatId, "Демон выигрывает " + DemonWins + ":" + playerWins);
        return 2;
      }
    });
};


Resolvers.prototype.getResult = function (questId, name, msg, extra) {
  switch (name) {
    case'setGender':
      return this.setGender(msg, questId);
      break;
    case'checkGender':
      return this.checkGender(msg, questId);
      break;
    case'takeItem':
      return this.takeItem(msg, questId, extra);
      break;
    case'playDice':
      return this.playDice(msg, questId, extra);
      break;
    case'die':
      return this.die(msg, questId, extra);
      break;
    case'finish':
      return this.finish(msg, questId, extra);
      break;
    default:
      throw new Error('module ' + name + ' does not exist!');
  }
};
module.exports = Resolvers;