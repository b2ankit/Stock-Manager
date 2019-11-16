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

var stockModel = require('../modules/stock')

var stock = stockModel.find({});

var sellrecords = stockModel.aggregate([{$match:{"category":"Sell"}},{$group:{_id:"$cementName",total:{$sum:"$quantity"}}}]);

var buyrecords = stockModel.aggregate([{$match:{"category":"Buy"}},{$group:{_id:"$cementName",total:{$sum:"$quantity"}}}]);



// Defining Middleware .....


function checkLoginUser(req,res,next){
  var usertkn = localStorage.getItem('userToken');
  try{
    jwt.verify(usertkn,'LoginToken');
  }
  catch(err){
    res.redirect('/login');
  }
  next();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var user = localStorage.getItem('loginUser');



  sellrecords.exec(function(err,data1){
    if(err) throw err
    
  

    buyrecords.exec(function(err,data2){
      if(err) throw err;
      

      res.render('index', { title: 'Stock Manager',username:user,sell:data1,buy:data2});

    })


    })
    
     
  
  
  
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
        res.redirect("/");
      }
      else{
        var msg = 'Invalid Username/Password'
      
        res.render('login',{title:'Stock Manager',msg:msg})
      }
    }
  })
})

//insert data into database
router.get('/insert',checkLoginUser, function(req, res, next) {
  var user = localStorage.getItem('loginUser');
  res.render('insert', { title: 'Stock Manager',username:user });
});


//code to show the database
router.get('/show',checkLoginUser, function(req, res, next) {
  var user = localStorage.getItem('loginUser');
  
  stock.exec(function(err,data){
    if(err) throw err;
    console.log(data);
    res.render('show', { title: 'Stock Manager',username:user,records:data });
  })
});

//code for insert data into database
router.post('/insert',checkLoginUser,function(req,res,next){
  var stockDetails = new stockModel({
    category:req.body.category,
    cementName:req.body.cementName,
    quantity:req.body.bag,
    date:req.body.date

})
stockDetails.save(function(err,res1){
  if(err) throw err;
  res.redirect('/show')
})
})


//code for delete entry from database
router.get('/delete/:id',checkLoginUser,function(req,res,next){
  var id = req.params.id;
  var del = stockModel.findByIdAndDelete(id);
  del.exec(function(err,data){
    if(err) throw err
    res.redirect('/show')
  })
})


//code for edit
router.get('/edit/:id',checkLoginUser,function(req,res,next){
  var id = req.params.id;
  var edit = stockModel.findById(id);
  edit.exec(function(err,data){
    if(err) throw err
    var user = localStorage.getItem('loginUser');
    res.render('edit',{ title: 'Stock Manager',username:user,records:data });
  })
})


//code for update data
router.post('/update',checkLoginUser,function(req,res,next){
  var update = stockModel.findByIdAndUpdate(req.body.id,{
    category:req.body.category,
    cementName:req.body.cementName,
    quantity:req.body.bag,
    date:req.body.date

  });

  update.exec(function(err,data){
    if(err) throw err;
    res.redirect('/show')
  })
})


//code for search by name
router.post('/search',checkLoginUser,function(req,res,next){
  var searchname = req.body.name;
  // console.log(searchname);
  var filtercement = stockModel.find({cementName:searchname});
  filtercement.exec(function(err,data){
    if(err) throw err;
    var user = localStorage.getItem('loginUser');
    res.render('show', { title: 'Stock Manager',username:user,records:data });
  })
})



//Logout route
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});


module.exports = router;
