import { User } from '../lib/mongo';

export default {
  // 注册用户
  // Eslint object-shorthand
  // create(user) {
  //   return User.create(user).exec();
  // },
  create: user => User.create(user).exec(),
  getUserByName: name => User
    .findOne({ name })
    .addCreatedAt()
    .exec(),
};
