import marked from 'marked';
import { Post } from '../lib/mongo';
import CommentModel from './comments';

// 将post的content从markdown转成html
Post.plugin('contentToHtml', {
  afterFind: posts => posts.map((post) => {
    post.content = marked(post.content);
    return post;
  }),
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  },
});

Post.plugin('addCommentsCount', {
  afterFind: posts => Promise.all(),
  afterFindOne: post => CommentModel.getCommentsCounts(post._id)
    .then(),
});

export default {
  // 创建一篇文章
  create: post => Post.create(post).exec(),

  // 通过文章id获取一篇文章
  getPostById: postId => Post
    .findOne({ _id: postId })
    .populate({ path: 'author', model: 'User' })
    .addCreatedAt()
    .contentToHtml()
    .exec(),
  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getPosts: (author) => {
    const query = {};
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },
  // 通过文章id给PV加1
  incPv: postId => Post
    .update({ _id: postId }, { $inc: { pv: 1 } }),
  // 通过文章id获取一篇原生文章（编辑文章）
  getRawPostById: postId => Post
    .findOne({ _id: postId })
    .populate({ path: 'author', model: 'User' })
    .exec(),
  // 通过用户id和文章id更新一篇文章
  updatePostById: (postId, author, data) => Post
    .update({ author, _id: postId }, { $set: data }).exec(),
  // 通过用户id和文章id删除一篇文章
  delPostById: (postId, author) => Post
    .remove({ author, _id: postId })
    .exec()
    .then((res) => {
      // 文章删除后，再删除该文章下的所有留言
      if (res.result.ok && res.result.n > 0) {
        return CommentModel.delCommentsByPostId(postId);
      }
    }),
};
