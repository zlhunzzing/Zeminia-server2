// Todo: 실제 디비 연결 후 확인필요~
const { users } = require('../../models');

module.exports = {
  get: async (req, res) => {
    if (req.session.userId) {
      const user = await users.findAll({ where: { id: req.session.userId } });
      const userData = {
        id: user[0].id,
        email: user[0].email
      };
      res.json(userData);
    } else {
      res.status(401).json({ infoCheck: 'Unauthorized' });
    }
  }
};
