const { users } = require('../../models');
const bcrypt = require('bcrypt');

module.exports = {
  post: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      //* need email, password validation check
      // Todo: email, password check

      const hash = bcrypt.hashSync(password, 8);
      const user = await users.findAll({ where: { email: email } });
      if (user[0]) {
        res.status(409).json({ failed: '이미 가입된 회원입니다' });
        return;
      }
      await users.create({
        email,
        password: hash
      });

      res.json({
        signupCheck: 'success'
      });
    } catch (err) {
      console.log(err);
      next();
    }
  }
};
