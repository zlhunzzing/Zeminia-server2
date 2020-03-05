const { monsters } = require('../../models');

//*: 테스트를 위해 세션 인증 코드 없음 추후 추가 필요

// 리퀘스트를 날릴 때 json 형태로 날려야 한다.
// {
//   "monsterId": "3"
// }
module.exports = {
  delete: async (req, res, next) => {
    try {
      const result = await monsters.destroy({
        where: { id: req.body.monsterId }
      });

      if (result === 0) {
        res.json({ info: '해당하는 몬스터가 없습니다' });
        return;
      }
      res.status(200).json({ monsterDelete: 'success' });
    } catch (err) {
      console.log(err);
      next();
    }
  }
};
