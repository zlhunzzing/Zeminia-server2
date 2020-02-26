// Todo: 실제 디비 연결 후 작동하는 지 체크하기
module.exports = {
  // Todo : logout 하는 경우 캐릭터를 저장해야하는 경우

  post: (req, res) => {
    if (req.session.userSess === req.session.id) {
      req.session.destroy();
      res.json({ signoutCheck: 'success' });
    } else {
      res.json({ signoutCheck: 'failed' });
    }
  }
};
