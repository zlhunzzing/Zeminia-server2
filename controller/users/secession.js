const { users } = require('../../models');
const bcrypt = require('bcrypt');

module.exports = {
  delete: async (req, res, next) => {
    try {
      if (!req.session.userId) {
        return res.json({ secessionCheck: 'failed' });
      }
      const { email, password } = req.body;
      const user = await users.findAll({ were: email });
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
          res.json({ secessionCheck: 'failed' });
          return;
        }
      } else {
        res.json({ secessionCheck: 'failed' });
      }
    } catch (err) {
      console.log('err============', err);
      next();
    }
  }
};
