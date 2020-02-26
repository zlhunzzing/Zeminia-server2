// Todo: 실제 디비 연결 후 확인필요~
const { users } = require('../../models');

module.exports = {
  get: async (req, res) => {
    if (req.session.userSess === req.session.id) {
      const user = await users.findAll({ where: { id: req.session.userId } });
      const userData = {
        id: user[0].id,
        email: user[0].email
      };
      res.json(userData);
      return;
    } else {
      res.status(401).json({ infoCheck: 'Unauthorized' });
      return;
    }
  }
};
