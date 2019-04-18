var mongoose = require('mongoose');
 
// make a connection
mongoose.connect('mongodb://localhost:27017/tutorialkart');
 
// get reference to database
var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function() {
    console.log("Connection Successful!");
    
    // define Schema
    var animal = mongoose.Schema({
      type: String,
      name: String
    });
 
    // compile schema to model
    var Animal = mongoose.model('animal_mgr', animal, 'ani');
 
    // a document instance
    var obj = new Animal({ type:'Soc', name: 'Kevil'});
 
    // save model to database
    obj.save(function (err, res) {
      if (err) return console.error(err);
      console.log(res.name + " has saved.");
    });
    
});
 