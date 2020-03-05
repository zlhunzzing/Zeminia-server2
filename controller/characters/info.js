const { characters, items } = require('../../models');

module.exports = {
  get: async (req, res, next) => {
    try {
      if (req.session.userId) {
        const info = await characters.findAll({
          include: [{ model: items }],
          where: { user_id: req.session.userId }
        });

        console.log(info[0]);

        if (info[0]) {
          res.status(200).send(info[0].dataValues);
        } else {
          res
            .status(404)
            .send({ noneCharacter: '해당 계정 캐릭터가 존재하지 않습니다' });
        }
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
