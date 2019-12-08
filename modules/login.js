var mongoose = require('mongoose');

bodyparser = require("body-parser");

// mongoose.connect('mongodb://localhost:27017/stock',{useNewUrlParser:true,useUnifiedTopology: true})
mongoose.connect('mongodb+srv://test:test@cluster0-hszqu.mongodb.net/test?retryWrites=true&w=majority')
var conn = mongoose.Connection;

var adminLoginSchema = new mongoose.Schema({
    username:String,
    password:String,
})

var adminLoginModel = mongoose.model('login',adminLoginSchema);

module.exports=adminLoginModel;