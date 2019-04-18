var express = require("express");
var mongo = require('./lib/mongo/mongoConnection.js');
var bodyParser = require('body-parser');

//Using express and config
var app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

//Cover in case: request URL is http://localhost:55000/animal/list?sort=desc&page=2
app.get('/animal/:query', (req, res)=>{
    mongo.getAnimal(req, res);
})

//Config router and start API service
app.use('/', router);
app.listen(55000);