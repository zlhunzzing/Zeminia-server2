const { monsters } = require('../../models');

module.exports = {
  patch: async (req, res, next) => {
    //*: 테스트를 위해 세션 인증 코드 없음 추후 추가 필요

    try {
      const { monster_name, level, hp, att, exp, drop, monsterId } = req.body;
      const options = {
        monster_name,
        level,
        hp,
        att,
        exp,
        drop,
        img: req.file ? `/image/${req.file.filename}` : 'none'
      };
      const result = await monsters.update(options, {
        where: { id: Number(monsterId) }
      });

      if (result[0] === 0) {
        res.json({ monsterUpdate: '해당하는 몬스터가 없습니다' });
        return;
      }
      res.status(201).send({ monsterUpdate: 'Success' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
