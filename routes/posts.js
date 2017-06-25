import express from 'express';
import check from '../middlewares/check';

const router = express.Router();
const checkLogin = check.checkLogin;

// GET /posts 所有用户或者特定用户的文章页
// eg:GET /posts?autor=xxx
router.get('/', checkLogin, (req, res) => {
  res.send(res.render('posts'));
});

// POST /posts 发表一篇文章
router.post('/', checkLogin, (req, res) => {
  res.send(req.flash());
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, (req, res) => {
  res.send(req.flash());
});

// GET /posts/:postId 单独一篇文章页
router.get('/:postId', checkLogin, (req, res) => {
  res.send(req, req.flash());
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, (req, res) => {
  res.send(req.flash());
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, (req, res) => {
  res.send(req.flash());
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, (req, res) => {
  res.send(req.flash());
});

// POST /posts/:postId/comment 创建一条留言
router.get('/:postId/comment', checkLogin, (req, res) => {
  res.send(req.flash());
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, (req, res) => {
  res.send(req.flash());
});

module.exports = router;
