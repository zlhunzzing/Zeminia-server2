const { items } = require('../../models');

module.exports = {
  post: async (req, res, next) => {
    //* : 테스트를 위해 세션 인증 코드 없음 추후 추가 필요

    try {
      const { item, att, def, cost } = req.body;
      const options = {
        item,
        att,
        def,
        cost
      };
      await items.create(options);
      res.status(201).send({ itemCreate: 'Success' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
