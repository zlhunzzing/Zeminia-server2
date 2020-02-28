const { characters } = require('../../models');

module.exports = {
  post: async (req, res, next) => {
    try {
      // session.userId 로 새로운 캐릭터 생성
      if (req.session.userId) {
        // db 생성 옵션
        const options = {
          user_id: req.session.userId,
          character_name: req.body.character_name
        };

        // 새 캐릭터 생성
        const newCharacter = await characters.create(options);
        res.status(200).send(newCharacter.dataValues);
        // res.status(200).send(newCharacter.dataVales);
      } else {
        res.status(404).send({ failed: '인증되지 않은 사용자 입니다.' });
      }
      // 새로운 캐릭터 생성후, response
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
