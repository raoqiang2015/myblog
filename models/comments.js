import marked from 'marked';
import { Comment } from '../lib/mongo';

// 将comment的content从markdown转换成html
Comment.plugin('contentToHtml', {
  afterFind: comments => comments.map((comment) => {
    comment.content = marked(comment.content);
    return comment;
  }),
  afterFindOne: (comment) => {
    if (comment) {
      comment.content = marked(comment.content);
    }
    return comment;
  },
});

export default {
  // 创建一个留言
  create: comment => Comment.create(comment).exec(),
  // 通过文章id获取该文章下的所有留言，按留言创建时间升序
  getComments: (postId) => {
    const query = {};
    if (postId) {
      query.postId = postId;
    }
    return Comment
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },
  // 通过用户Id和留言Id删除一个留言
  delCommentById: (author, commentId) => Comment.remove({ author, _id: commentId }).exec(),
  // 通过用户Id
  delCommentsByPostId: postId => Comment.remove({ postId }).exec(),
  // 通过文章Id 获取该文章留言数
  getCommentsCounts: postId => Comment
    .count({ postId }).exec(),
};
