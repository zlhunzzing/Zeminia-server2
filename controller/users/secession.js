const bcrypt = require('bcrypt');
const { users } = require('../../models');

module.exports = {
  delete: async (req, res, next) => {
    try {
      if (!req.session.userId) {
        res.json({ secessionCheck: 'failed_session' });
        return;
      }

      const { email, password } = req.body;
      const user = await users.findAll({ where: { email } });
      if (user[0]) {
        const match = await bcrypt.compare(password, user[0].password);
        if (match) {
          await users.destroy({ where: { id: req.session.userId } });
          req.session.destroy();
          res.json({
            secessionCheck: 'success'
          });
          return;
        }
        if (!match) {
          res.json({ secessionCheck: 'failed_password' });
          return;
        }
      } else {
        res.json({ secessionCheck: 'failed_user' });
        return;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('err: ', err);
      next();
    }
  }
};
