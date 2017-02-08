'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    config      = require("./config/config.json"),
    Promise     = require("bluebird"),
    knex        = require('knex')(config.knex),
    token       = config.telegram.token,
    bot         = new TelegramBot(token, {polling: true}),
    Resolvers   = require("./modules/resolvers.js"),
    resolvers   = new Resolvers(bot, knex),
    Checkers    = require("./modules/checkers.js"),
    colors      = require('colors/safe'),
    checkers    = new Checkers(bot, knex);

var captureQueries = function (builder) {

  builder.on('query', function (query) {
    console.log(colors.cyan("Knex query:\n  " + query.sql));
  });
};
knex.client.on('start', captureQueries);
/**
 * Add user and return init state
 * @param msg
 */
var addUser = function (msg) {
  var chatId = msg.from.id;
  var currentDate = new Date();
  currentDate = currentDate.toISOString();
  var user = {
    "added": currentDate,
    "modified": currentDate,
    "telegram_id": chatId,
    "current_quest": 1,
    "first_name": msg.chat.first_name,
    "username": msg.chat.username
  };
  return knex('users').returning('id').insert(user)
    .then(function (userId) {
      console.log('user added');
      var userQuest = {user_id: userId[0], quest_id: 1, stage_id: 1, completed: 0};
      console.log(userQuest);
      return knex('user_quest')
        .returning('id').insert(userQuest).then(function () {
          console.log('first quest added');
          return userId[0];
        });
    })
    .catch(function (e) {
      console.log('user not added' + e.toString())
    });
};

var cleanUpItems = function (userId, questId) {
  console.log("Cleaning up user items");
  return knex('user_item').where({user_id: userId, quest_id: questId}).delete();
};

var resetStage = function (userId, questId) {
  console.log("resettings stage");
  return knex('user_quest').where({
    user_id: userId,
    quest_id: questId
  })
    .update({"stage_id": 1});
};

var getStageData = function (userId, questId) {
  return knex('user_quest')
    .where({
      user_id: userId,
      quest_id: questId
    })
    .first('user_id', 'quest_id', 'stage_id').then(function (data) {
      return data
    });
};

var resetCurrentQuest = function (userId) {
  return knex('users').where({
    id: userId
  }).first('current_quest').then(function (currentQuest) {
    var cleanUp = cleanUpItems(userId, currentQuest.current_quest);
    var resetStageData = resetStage(userId, currentQuest.current_quest);
    return Promise.all([cleanUp, resetStageData]);
  });
};

var getCurrentQuest = function (userId) {
  return knex('users').where({
    id: userId
  }).first('current_quest').then(function (data) {
    return data.current_quest;
  });
};


var start = function (msg) {
  var chatId = msg.from.id;

  return knex('users').where({
    telegram_id: chatId
  }).first('id')
    .then(function (data) {
      console.log(data);
      if (data === undefined) {
        console.log("No user found, adding user");
        return addUser(msg);
      }
      else //returning user should go to first stage
      {
        console.log("User found, resetting quest");
        return resetCurrentQuest(data.id).then(function () {
          console.log("quest reset ok");
          return data.id;
        });
      }
    })
    .then(function (userId) {
      console.log("Fetching current quest");
      getCurrentQuest(userId).then(function (questId) {
        return getStageData(userId, questId)
      }).then(function (stageData) {
        console.log('Starting stage data:');
        console.log(stageData);
        showStage(stageData, msg);
      })
    });
};
var checkActionsAvailable = function (stageData, actions, msg) {
  var actionsChecks = [];
  var actionsAvailable = [];
  return actions.then(function (actionsData) {

    //console.log("Full actions:");
    //console.log(actionsData);
    for (var i = 0; i < actionsData.length; i++) {
      if (actionsData[i].checker != undefined) {

        console.log('found checker ' + actionsData[i].checker);
        var actionCheck = checkers.check(stageData.quest_id, actionsData[i].checker, msg, {id: actionsData[i].checker_extra_id});
        actionsChecks.push(actionCheck);
      }
      else {
        console.log('checker not found, auto resolving');
        actionsChecks.push(Promise.resolve(1));
      }
    }
    //console.log(actionsChecks);
    return Promise.all(actionsChecks)
      .then(function (dataArray) {
        //console.log('all resolved');
        //console.log("Action checks:");
        //console.log(dataArray);
        for (var i = 0; i < dataArray.length; i++) {
          if (dataArray[i] === 1)
            actionsAvailable.push({text: actionsData[i].value});
        }
        return actionsAvailable;
      })
  });
};

var showStage = function (stageData, msg, options) {
  console.log('Received stage data (show):');
  console.log(stageData);
  var chatId = msg.from.id;
  var actions = knex('stage_actions').leftJoin('checkers', 'stage_actions.checker', 'checkers.id').where({
    quest_id: stageData.quest_id,
    stage_id: stageData.stage_id
  }).select('stage_actions.value', 'checkers.name as checker', 'stage_actions.checker_extra_id');
  actions = checkActionsAvailable(stageData, actions, msg);

  if (options !== undefined && options.hideDescription === true) {//need only to reload actions
    actions.then(function (data) {
      console.log('actions ' + JSON.stringify(data));
      var opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: [data]
        })
      };
      bot.sendMessage(chatId, "Что будем делать теперь?", opts);
    });
    return;
  }

  var description = knex('stages').where({
    quest_id: stageData.quest_id,
    id: stageData.stage_id
  }).select('description').first();
  var images = knex('stage_image').where({
    quest_id: stageData.quest_id,
    stage_id: stageData.stage_id
  }).select('placement', 'image', 'caption');
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
    bot.sendMessage(chatId, data[1].description, opts);
  })
};


var doStage = function (stageData, msg) {
  console.log('Received stage data (do):');
  console.log(stageData);
  console.log(msg);
  knex('stage_actions').leftJoin('resolvers', 'stage_actions.resolver', 'resolvers.id').where({
    quest_id: stageData.quest_id,
    stage_id: stageData.stage_id,
    value: msg.text
  }).first('stage_actions.value', 'stage_actions.choice', 'resolvers.name as resolver', 'stage_actions.resolver_extra_id').then(function (data) {
    if (data === undefined) {
      //no such action?! Try repeating stage - this is the most we can
      console.log(colors.red('no action ' + msg.text + ' on stage ' + stageData.stage_id + ' in quest ' + stageData.quest_id));
      showStage(stageData, msg);
      return;
    }
    var choice = Promise.resolve(data.choice);
    if (data.resolver != undefined) {
      console.log('found resolver: ' + data.resolver);
      choice = resolvers.getResult(stageData.quest_id, data.resolver, msg, {id: data.resolver_extra_id});
    }
    else {
      console.log('no resolver, simple transfer');
    }
    choice.then(function (chosen) {

      if (chosen === -1)//do not go to next stage, reload actions
      {
        showStage(stageData, msg, {hideDescription: true});
        return;
      }
      knex('stage2stage').where({
        quest_id: stageData.quest_id, from_stage: stageData.stage_id, choice: chosen
      }).first('to_stage')
        .then(function (stageLink) {
          return knex('user_quest').where({
            quest_id: stageData.quest_id,
            user_id: stageData.user_id
          }).update({stage_id: stageLink.to_stage})
            .then(function () {
              return stageLink.to_stage;
            })
        })
        .then(function (toStage) {
          var newStageData = {quest_id: stageData.quest_id, user_id: stageData.user_id, stage_id: toStage};
          showStage(newStageData, msg);
        });
    });
    //if action was wrong, show stage again
  })
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
 */
bot.on('message', function (msg) {
  var chatId = msg.from.id;
  if (msg.text.charAt(0) === '/')
    return;

  knex('users').join('user_quest', 'users.id', '=', 'user_quest.user_id').where({
    telegram_id: chatId
  }).first('user_id', 'quest_id', 'stage_id').then(function (stageData) {
    doStage(stageData, msg);
  });
});