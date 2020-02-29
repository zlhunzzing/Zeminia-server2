const { characters } = require('../../models');

module.exports = {
  get: async (req, res, next) => {
    try {
      if (req.session.userId) {
        const info = await characters.findAll({
          where: { user_id: req.session.userId }
        });
        res.status(200).send(info[0].dataValues);
      } else {
        // 세션아이디 없음. 불가능한 접근
        res.status(401).send({ failed: '인증되지 않은 사용자 입니다.' });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
