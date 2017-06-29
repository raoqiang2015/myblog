import express from 'express';
import check from '../middlewares/check';
import PostModel from '../models/posts';

const router = express.Router();
const checkLogin = check.checkLogin;

// GET /posts 所有用户或者特定用户的文章页
// eg:GET /posts?author=xxx
router.get('/', checkLogin, (req, res, next) => {
  const author = req.query.author;
  PostModel.getPosts(author)
    .then((posts) => {
      res.render('posts', { posts });
    })
    .catch(next);
});

// POST /posts 发表一篇文章
router.post('/', checkLogin, (req, res, next) => {
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;

  // 检验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return req.redirect('back');
  }

  let post = {
    author, title, content, pv: 0,
  };

  PostModel.create(post)
    .then((result) => {
      // 此post是插入mongodb后的值，包含_id
      post = result.ops[0];
      req.flash('success', '发布成功');
      // 发表成功后跳转到该文章页
      res.redirect(`/posts/${post._id}`);
    })
    .catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, (req, res) => {
  res.render('create');
});

// GET /posts/:postId 单独一篇文章页
router.get('/:postId', checkLogin, (req, res, next) => {
  const postId = req.params.postId;

  Promise.all([
    PostModel.getPostById(postId), // 获取文章信息
    PostModel.incPv(postId),
  ])
  .then((result) => {
    const post = result[0];
    if (!post) {
      throw new Error('该文章不存在的');
    }
    res.render('post', { post });
  })
  .catch(next);
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId;
  const author = req.session.user._id;

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不够');
      }
      res.render('edit', { post });
    })
    .catch(next);
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId;
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;

  PostModel.updatePostById(postId, author, { title, content })
    .then(() => {
      res.flash('success', '编辑文章成功');
      res.redirect(`/posts/${postId}`);
    })
    .catch(next);
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
