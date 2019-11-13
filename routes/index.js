var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stock Manager' });
});

router.get('/records',function(req,res,next){
  res.render('records',{title:'Stock Manager'})
})

router.get('/Stocks',function(req,res,next){
  res.render('stocks',{title:'Stock Manager'})
})
module.exports = router;
