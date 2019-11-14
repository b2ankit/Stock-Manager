var mongoose = require('mongoose');

bodyparser = require("body-parser");

mongoose.connect('mongodb://localhost:27017/stock',{useNewUrlParser:true,useUnifiedTopology: true})

var conn = mongoose.Connection;

var adminLoginSchema = new mongoose.Schema({
    username:String,
    password:String,
})

var adminLoginModel = mongoose.model('login',adminLoginSchema);

module.exports=adminLoginModel;