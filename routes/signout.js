var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check.js').checkLogin;


//GET /signout 登出页
router.get('/',checkLogin,function(req,res,next){
  res.send(req.flash());
});

module.exprots = router;
