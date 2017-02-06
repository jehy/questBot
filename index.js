'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    config      = require("./config/config.json");

// replace the value below with the Telegram token you receive from @BotFather
var token = config.telegram.token;

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, {polling: true});

var start=function(msg)
{
  var chatId = msg.chat.id;
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ['Подойти к зеркалу']
      ]
    })
  };
  console.log(msg);
  bot.sendMessage(chatId, "Вы оказываетесь в огромном, безграничном и бесплотном нигде." +
    " Вокруг есть большое ростовое зеркало и несколько мерцающих дверей. Хочется назвать их \"порталами\"." +
    "Один из них мерцает красным заревом, остальные темны и затянуты паутиной.", opts);
};

// Matches "/echo [whatever]"
bot.onText(/\/start/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
start(msg);
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  var chatId = msg.chat.id;
  var resp = match[1]; // the captured "whatever"

  console.log(msg);
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
var lookMirror=function(msg)
{
  var chatId = msg.chat.id;

  const photo = "./img/unknown_gender.gif";
  bot.sendPhoto(msg.chat.id, photo, {
    caption: "Вы видите в зеркале"
  });
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ['Мужчина'],
        ['Женщина']
      ]
    })
  };
  console.log(msg);
  bot.sendMessage(chatId, "Изображение туманное и неясное, хоть как-то можно разглядеть, что там...", opts);
};

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  if (msg.text.charAt(0) === '/')
    return;
  console.log(msg);
  // send a message to the chat acknowledging receipt of their message

  if(msg.text==='Подойти к зеркалу') {
    lookMirror(msg);
    return;
  }
  if(msg.text==='Мужчина' ||msg.text==='Женщина')
  {
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [
          ['Войти в портал']
        ]
      })
    };
    var gender=msg.text.toLowerCase();
    if(gender==='мужчина')
    {
      const photo = "./img/male.jpg";
      bot.sendPhoto(msg.chat.id, photo, {
        caption: "Вы видите в зеркале"
      });
    }
    else
    {
      const photo = "./img/female.jpg";
      bot.sendPhoto(msg.chat.id, photo, {
        caption: "Вы видите в зеркале"
      });
    }
    bot.sendMessage(chatId, "Хорошо, вы хотя бы поняли, что вы "+gender+". Больше здесь делать, видимо, ничего...", opts);
    return;
  }
  start(msg);


  //bot.sendMessage(chatId, "Received your message");
});