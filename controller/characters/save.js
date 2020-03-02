const { characters } = require('../../models');

module.exports = {
  post: async (req, res, next) => {
    try {
      if (req.session.userId) {
        const {
          level,
          maxHp,
          hp,
          att,
          exp,
          character_name,
          def,
          rankScore,
          gold,
          mp,
          weapon
        } = req.body;
        const saveData = {
          level,
          maxHp,
          hp,
          att,
          exp,
          character_name,
          def,
          rankScore,
          gold,
          mp,
          weapon
        };
        await characters.update(saveData, { where: { id: req.body.id } });
        res.status(200).send({ saveCheck: 'success' });
      } else {
        res.status(401).send({ failed: '인증되지 않은 사용자 입니다.' });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
