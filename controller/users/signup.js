const bcrypt = require('bcrypt');
const { users } = require('../../models');

module.exports = {
  post: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      //* email, password validation check
      if (email === '' || password === '') {
        res.status(409).json({ failed: '값을 정확하게 입력해주세요' });
        return;
      }

      if (email.includes(' ') || password.includes(' ')) {
        res.status(409).json({ failed: '공백은 허용하지 않습니다' });
        return;
      }

      const regExpEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      if (email.match(regExpEmail) === null) {
        res.status(409).json({ failed: 'email 형식에 맞게 값을 넣어주세요' });
        return;
      }

      const regExpPw = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      if (regExpPw.test(password) === false) {
        res
          .status(409)
          .json({ failed: '8자 이상, 소문자, 숫자, 특수문자 필요합니다' });

        return;
      }

      const hash = bcrypt.hashSync(password, 8);
      const user = await users.findAll({ where: { email } });
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
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
