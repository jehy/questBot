"use strict";

const Promise      = require('bluebird'),
      config       = require('../config/config.test.json'),
      TelegramBot  = require('node-telegram-bot-api'),
      colors       = require('colors/safe'),
      rp           = require('request-promise'),
      QuestBot     = require('../QuestBot'),
      TelegramTest = require('telegram-test'),
      bot          = new TelegramBot(config.telegram.token, {}),
      telegramTest = new TelegramTest(bot),
      questBot     = new QuestBot(bot, config);

const envMode = (process.env.NODE_ENV || 'development');
let testChat = 1;
/*
 const goRoute = function (chatId, action) {
 if (action != undefined) {
 var msg = telegramTest.makeMessage(action, {chatId: chatId});
 console.log(colors.green("Sending message: " + JSON.stringify(msg)));
 bot.processUpdate(msg);
 }
 return new Promise(function (resolve, reject) {
 bot.on('testMessage', function handler(msgChatId, text, form) {
 bot.removeListener('testMessage', handler);
 if (chatId === msgChatId) {
 console.log(colors.blue("Received message: " + text + JSON.stringify(form)));
 if (form.reply_markup) {
 resolve(JSON.parse(form.reply_markup).keyboard);
 }
 else resolve(goRoute(chatId));
 }
 })
 }).then(keyboard=> {
 console.log(colors.yellow("Keyboard: " + JSON.stringify(keyboard)));
 return keyboard;
 })
 };*/


console.log('Running tests in mode ' + envMode);
describe('Telegram Quest Bot tests', function () {
  it('should pass quest', function () {
    this.timeout(30000);
    this.slow(8000);
    var myChat = testChat;
    testChat++;
    return telegramTest.sendUpdate(myChat, "/start")
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//look at the mirror
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//I am a man!
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//enter the portal
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//take dice})
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//take pomade
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//draw
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//split blood
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][1].text);//play dice
      })
      .then(data=> {
        return telegramTest.sendUpdate(myChat, data.keyboard[0][0].text);//quest passed or failed (depending on dice)
      });
  });
});