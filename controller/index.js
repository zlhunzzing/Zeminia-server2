const usersController = require('./users');

module.exports = {
  usersController,
  charactersController: require('./characters')
};
