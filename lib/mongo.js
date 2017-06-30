import configLite from 'config-lite';
import Mongolass from 'mongolass';
import moment from 'moment';
import objectIdToTimestamp from 'objectid-to-timestamp';

const mongolass = new Mongolass();
const config = configLite(__dirname);

mongolass.connect(config.mongodb);
mongolass.plugin('addCreatedAt', {
  afterFind(results) {
    results.forEach((item) => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne(result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  },
});
// 定义了用户表的schema，生成并导出了User这个model，同时设置了name的唯一索引
const User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' },
});
User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一
// 定义了文章表的Schema，生成并导出了Post这个model，设置按创建时间查看
const Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' },
});
Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表
// 定义留言表的Schema，生成并导出Comment这个model
const Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId, ref: 'User' },
  content: { type: 'string' },
  postId: { type: Mongolass.Types.ObjectId, ref: 'Post' },
});
Comment.index({ postId: 1, _id: 1 }).exec();
Comment.index({ author: 1, _id: 1 }).exec();
export { User, Post };
