/*
*路由入口
*/
import signupRoute from './signup';
import signinRoute from './signin';
import signoutRoute from './signout';
import postsRoute from './posts';

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/posts');
  });
  app.use('/signup', signupRoute);
  app.use('/signin', signinRoute);
  app.use('/signout', signoutRoute);
  app.use('/posts', postsRoute);
  app.use((req, res) => {
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
};
