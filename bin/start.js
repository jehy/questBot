"use strict";

var TelegramBot = require('node-telegram-bot-api'),
    config      = require("../config/config.json"),
    bot         = new TelegramBot(config.telegram.token, {polling: true}),
    QuestBot    = require('../QuestBot'),
    questBot    = new QuestBot(bot, config);