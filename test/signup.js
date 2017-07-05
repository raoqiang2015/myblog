var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../index');
var User = require('../lib/mongo').User;

var testName1 = 'tesme142d';
var testName2 = '123fd22';
describe('signup', function () {
  describe('POST /signup', function () {
    var agent = request.agent(app);// persist cookie when redirect
    beforeEach(function (done) {
      // 创建一个用户
      User.create({
        name: testName1,
        password: '123456',
        avatar: '',
        gender: 'x',
        bio: '',
      })
      .exec()
      .then(function () {
        done();
      })
      .catch(done);
    });

    afterEach(function (done) {
      // 删除测试用户
      User.remove({ name: { $in: [testName1, testName2] } })
        .exec()
        .then(function () {
          done();
        })
        .catch(done);
    });

    // 名户名错误的情况
    it('wrong name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: '' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err);
          assert(res.text.match(/名字请限制在 1-10 个字符/));
          done();
        });
    });

    // 性别错误的情况
    it('wrong gender', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: testName2, gender: 'a' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err);
          assert(res.text.match(/性别只能是 m、f 或 x/));
          done();
        });
    });
    // 个人简介限制情况
    it('wrong bio', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: testName1, gender: 'm', bio: '', password: '123456', repassword: '123456' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/个人简介请限制在 1-30 个字符/));
          done();
        });
    });
    // 缺少头像
    it('lack avatar', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach()
        .field({ name: testName1, gender: 'm', bio: 'noder', password: '12345', repassword: '123456' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/缺少头像/));
          done();
        });
    });
    // 密码至少 6 个字符
    it('wrong password', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: testName1, gender: 'm', bio: 'noder', password: '12345', repassword: '123456' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/密码至少 6 个字符/));
          done();
        });
    });
    // 两次输入密码不一致
    it('password do not match', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: testName1, gender: 'm', bio: 'noder', password: '123456', repassword: '123457' })
        .redirects()
        .end((err, res) => {
          if (err) return done(err);
          assert(res.text.match(/两次输入密码不一致/));
          done();
        });
    });
    // 用户名被占用的情况
    it('duplicate name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: testName1, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err);
          assert(res.text.match(/用户名已被注册/));
          done();
        });
    });

    // 注册成功的情况
    it('success', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name: testName2, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err);
          assert(res.text.match(/注册成功/));
          done();
        });
    });
  });
});
