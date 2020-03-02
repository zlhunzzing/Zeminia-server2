const bcrypt = require('bcrypt');
const { users } = require('../../models');

module.exports = {
  delete: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await users.findOne({ where: { email } });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          await users.destroy({ where: { email } });
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
