"use strict";

var MessageGenerator = function (messageId = 1000, updateId = 0) {
  this.messageId = messageId;
  this.updateId = updateId;
};

MessageGenerator.prototype.makeMessage = function (messageText, options = {}) {
  options.userId = options.userId || 1;
  options.chatId = options.chatId || 1;
  options.firstName = options.firstName || 'TestName';
  options.userName = options.userName || 'testUserName';
  this.messageId++;
  this.updateId++;
  return {
    update_id: this.updateId,
    message: {
      message_id: this.messageId,
      from: {id: options.userId, first_name: options.firstName, username: options.userName},
      chat: {
        id: options.chatId,
        first_name: options.firstName,
        username: options.userName,
        type: 'private'
      },
      date: Math.floor(Date.now() / 1000),
      text: messageText
    }
  }
};

module.exports = MessageGenerator;