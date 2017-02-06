'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    config      = require("./config/config.json"),
    Promise     = require("bluebird"),
    knex        = require('knex')(config.knex);
// replace the value below with the Telegram token you receive from @BotFather
var token = config.telegram.token;

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, {polling: true});

var start = function (msg) {
  var chatId = msg.from.id;

  return knex('users').where({
    telegram_id: chatId
  }).select('id')
    .then(function (data) {
      console.log(data);
      if (data.length === 0) {
        console.log("Adding user");
        var currentdate = new Date();
        currentdate = currentdate.toISOString();
        var user = {
          "added": currentdate,
          "modified": currentdate,
          "telegram_id": chatId,
          "current_quest": 1,
          "first_name": msg.chat.first_name,
          "username": msg.chat.username
        };
        return knex('users').returning('id').insert(user)
          .then(function (userId) {
            console.log('user added');
            var userQuest = {"user_id": userId[0], "quest_id": 1, "stage_id": 1, "completed": 0};
            console.log('first quest added');
            return knex('user_quest').insert(userQuest).then(function () {
              return userQuest;
            });
          })
          .catch(function (e) {
            console.log('user not added' + e.toString())
          });
      }
      else//returning user should go to first stage
      {
        return knex('user_quest').where({
          user_id: data[0]['id']
        })
          .update({"stage_id": 1})
          .then(function () {
            return knex('user_quest')
              .where({
                user_id: data[0]['id']
              })
              .select('user_id', 'quest_id', 'stage_id').then(function (data) {
                return data[0]
              });
          });
      }
    })
    .then(function (stageData) {
      console.log('Starting stage data:');
      console.log(stageData);
      showStage(stageData, msg);
    });
  /*
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
   "Один из них мерцает красным заревом, остальные темны и затянуты паутиной.", opts);*/
};
var showStage = function (stageData, msg) {
  console.log('Received stage data (show):');
  console.log(stageData);
  var chatId = msg.from.id;
  var description = knex('stages').where({
    quest_id: stageData.quest_id,
    id: stageData.stage_id
  }).select('description');
  var actions = knex('stage_actions').where({
    quest_id: stageData.quest_id,
    stage_id: stageData.stage_id
  }).select('value as text');
  var images = knex('stage_image').where({
    quest_id: stageData.quest_id,
    stage_id: stageData.stage_id
  }).select('placement', 'image');
  images.then(function (imagesData) {
    if (imagesData.length === 0) {
      return;
    }
    //for now we have only one image
    var photo = "./img/" + imagesData[0]['image'];
    bot.sendPhoto(msg.from.id, photo, {
      caption: imagesData[0]['caption']
    });
  });
  Promise.all([actions, description]).then(function (data) {
    console.log('actions and description' + JSON.stringify(data));
    var opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [data[0]]
      })
    };
    bot.sendMessage(chatId, data[1][0].description, opts);
  })
};

var doStage = function (stageData) {
  console.log('Received stage data (do):');
  console.log(stageData);
};


// Matches "/echo [whatever]"
bot.onText(/\/start/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  start(msg);
});


// Matches "/echo [whatever]"
/*bot.onText(/\/echo (.+)/, function (msg, match) {
 // 'msg' is the received Message from Telegram
 // 'match' is the result of executing the regexp above on the text content
 // of the message

 var chatId = msg.from.id;
 var resp = match[1]; // the captured "whatever"

 console.log(msg);
 // send back the matched "whatever" to the chat
 bot.sendMessage(chatId, resp);
 });


 var lookMirror = function (msg) {
 var chatId = msg.from.id;

 const photo = "./img/unknown_gender.gif";
 bot.sendPhoto(msg.from.id, photo, {
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
 };*/

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', function (msg) {
  var chatId = msg.from.id;
  if (msg.text.charAt(0) === '/')
    return;

  knex('users').join('user_quest', 'users.id', '=', 'user_quest.user_id').where({
    telegram_id: chatId
  }).select('user_id', 'quest_id', 'stage_id').then(function (stageData) {
    doStage(stageData, msg);
  });
  /*
   .then(function (data) {



   console.log(msg);
   // send a message to the chat acknowledging receipt of their message

   if (msg.text === 'Подойти к зеркалу') {
   lookMirror(msg);
   return;
   }
   if (msg.text === 'Мужчина' || msg.text === 'Женщина') {
   const opts = {
   reply_to_message_id: msg.message_id,
   reply_markup: JSON.stringify({
   keyboard: [
   ['Войти в портал']
   ]
   })
   };
   var gender = msg.text.toLowerCase();
   var data = 'M';
   if (gender === 'Женщина') {
   data = 'F';
   }
   knex('users').where('telegram_id', chatId).update({"gender": data}).then(function () {
   console.log('gender set');
   }).catch(function (e) {
   console.log('gender not set' + e.toString())
   });
   if (gender === 'мужчина') {
   const photo = "./img/male.jpg";
   bot.sendPhoto(msg.from.id, photo, {
   caption: "Вы видите в зеркале"
   });
   }
   else {
   const photo = "./img/female.jpg";
   bot.sendPhoto(msg.from.id, photo, {
   caption: "Вы видите в зеркале"
   });
   }
   bot.sendMessage(chatId, "Хорошо, вы хотя бы поняли, что вы " + gender + ". Больше здесь делать, видимо, ничего...", opts);
   return;
   }
   start(msg);


   //bot.sendMessage(chatId, "Received your message");*/
});