import express from 'express';
import check from '../middlewares/check';

const router = express.Router();
const checkNotLogin = check.checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, (req, res) => {
  res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, (req, res) => {
  res.render('signin');
});

export default router;
