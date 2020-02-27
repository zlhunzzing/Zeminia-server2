const { users } = require('../../models');
const bcrypt = require('bcrypt');

module.exports = {
  post: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      //* need email, password validation check
      // Todo: email, password check

      const user = await users.findAll({ where: { email } });
      // 유저가 있는 경우
      if (user[0]) {
        const match = await bcrypt.compare(password, user[0].password);
        // password 일치
        if (match) {
          req.session.userId = user[0].id;
          req.session.userSess = req.session.id;
          res.json({
            signinCheck: 'success'
          });
          return;
        }
        // password 불일치
        if (!match) {
          res.json({ signinInfo: '아이디와 비밀번호를 다시 확인해주세요' });
          return;
        }
      }
      // 유저가 없는 경우
      else {
        res.json({ signinInfo: '아이디와 비밀번호를 다시 확인해주세요' });
      }
    } catch (err) {
      console.log(err);
      next();
    }
  }
};
