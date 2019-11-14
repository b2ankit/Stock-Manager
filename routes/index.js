var express = require('express');
var router = express.Router();


//Require jsonwebtoken
var jwt = require('jsonwebtoken');

//Require node localStorage npm
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


var adminLoginModel = require('../modules/login');




/* GET home page. */
router.get('/', function(req, res, next) {
  var user = localStorage.getItem('loginUser');
  res.render('index', { title: 'Stock Manager',username:user });
});

router.get('/records',function(req,res,next){
  var user = localStorage.getItem('loginUser');
  res.render('records',{title:'Stock Manager',username:user})
})

router.get('/Stocks',function(req,res,next){
  var user = localStorage.getItem('loginUser');
  res.render('stocks',{title:'Stock Manager',username:user})
})

router.get('/login',function(req,res,next){
  
  var msg=''
  res.render('login',{title:'Stock Manager',msg:msg})
})

router.post('/login',function(req,res,next){

// insert data into database

// var loginDetails = new adminLoginModel({
//   username : req.body.uname,
//   password : req.body.password
// })
// loginDetails.save(function(err,res1){
//   if(err) throw err;
//   console.log('inserted');
// })



  var username = req.body.uname;
  var password = req.body.password;
  

  var loginFilter  = adminLoginModel.findOne({$and:[{username:username},{password:password}]});

  loginFilter.exec(function(err,data){
    if(err) throw err;
    else{
      if(data !==null){
        var user = data.username;
        var id = data.id;
        console.log(id,user)
        //start the token
        var token = jwt.sign({userId:id},'LoginToken');

        //save signin Token in local Storage
        localStorage.setItem('userToken',token);

        //Save login username in Local Storage
        localStorage.setItem('loginUser',user);
        res.render('index',{title:'Stock Manager',username:user})
      }
      else{
        var msg = 'Invalid Username/Password'
      
        res.render('login',{title:'Stock Manager',msg:msg})
      }
    }
  })
})

//insert data into database
router.get('/insert', function(req, res, next) {
  var user = localStorage.getItem('loginUser');
  res.render('insert', { title: 'Stock Manager',username:user });
});




//Logout route
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});


module.exports = router;
