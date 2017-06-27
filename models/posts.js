import { Post } from '../lib/mongo';

export default {
  // 创建一篇文章
  create: post => Post.create(post).exec(),
};
