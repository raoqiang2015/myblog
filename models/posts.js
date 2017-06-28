import marked from 'marked';
import { Post } from '../lib/mongo';

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
};
