import sha1 from 'sha1';
import express from 'express';
import check from '../middlewares/check';
import UserModel from '../models/user';

const router = express.Router();
const checkNotLogin = check.checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, (req, res) => {
  res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, (req, res, next) => {
  const name = req.fields.name;
  const password = req.fields.password;

  UserModel.getUserByName(name)
    .then((user) => {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('back');
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误');
        return res.redirect('back');
      }
      req.flash('success', '登录成功');
      // 用户信息写入 session
      delete user.password;
      req.session.user = user;
      return res.redirect('/posts');
    })
    .catch(next);
});

export default router;
