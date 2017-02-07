var getModuleResult = function (knex, name, msg) {

  /**
   * saves user gender and returns choise value
   * @param msg
   * @returns {1|2} 1 for male, 2 for female
   */
  var setGender = function (msg) {
    var chatId = msg.from.id;
    var gender = msg.text.toLowerCase();
    var data = 'M';
    if (gender === 'женщина') {
      data = 'F';
    }
    knex('users').where('telegram_id', chatId).update({"gender": data}).then(function () {
      console.log('gender set');
    });
    if (data === 'M')
      return 1;
    return 2;
  };

  if (name === 'setGender')
    return setGender(msg);
};
module.exports = getModuleResult;