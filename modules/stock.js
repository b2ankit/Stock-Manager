var mongoose = require('mongoose');

bodyparser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/stock',{useNewUrlParser:true,useUnifiedTopology: true})
// mongoose.connect('mongodb+srv://test:test@cluster0-hszqu.mongodb.net/test?retryWrites=true&w=majority')

var conn = mongoose.Connection;

var stockSchema = new mongoose.Schema({
    category:String,
    cementName:String,
    quantity:Number,
    date:String,
    month:String,

})

var stockModel = mongoose.model('stock',stockSchema);

module.exports=stockModel;