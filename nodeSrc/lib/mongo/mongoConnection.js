//
// required definition
//
const mongo = require('mongodb');
const url = "mongodb://localhost:27017/animal_mgr";
const array = require('lodash/array');
const collMongo = 'animal_info';
const PAGE_RECORDS = 5;

//
// Implement readline to using on input animal information function
//
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})


//
// Add new animal to database
//
function addNewAnimal(){
    //
    // define an object to storage animal information during user inputing
    //
    let newObj = {};

    //Let user input the category
    readline.question('Input animal categry: ', (val)=>{
        newObj.animalCategory = val

        //Let user input name
        readline.question('Input animal name: ', (name)=>{
            newObj.animalname = name

            //Close readline process
            readline.close();

            //add new animal into db
            addData(collMongo, newObj, (err)=>{
                if(err){
                    throw err;
                }else{
                    console.log('Inserted successfully!')
                }
            });
        })
    })
}

//
// handle add new data process
//
function addData(collectionName, data, next){
    //Connect to mongo
    mongo.connect(url, { useNewUrlParser: true }, (err, database) =>{
        if(err){
            throw err;
        }
        console.log('Connected!');
        
        //Point to collection name
        var coll = database.db(collectionName);
    
        //execute collection with collection name has defined.
        coll.collection(collectionName,  (err, collection) => {
            console.log('Collecting to insert..')
            
            //Check the collection has defined does not exist in mongodb
            if(err){
                console.log('Can not collect the input collection')
                database.close();
                return next(err);
            }
    
            //In case not err, insert data into collection
            console.log('Inserting..')
            collection.insertOne(data, (err)=>{
                console.log(data)

                //Check err in insert result
                if(err){
                    throw err;
                }

                //Close connection
                database.close();
                console.log('Connection Closed..')
                return next(err);
            });;
        })
    });
}

//
// get data by condition param
//
function getData(collectionName, category, req, next){
    //Connect to mongo
    mongo.connect(url, { useNewUrlParser: true }, (err, database) =>{
        if(err){
            throw err;
        }
        console.log('Connected!');
        
        //Point to collection name
        var coll = database.db(collectionName);
    
        //execute collection with collection name has defined.
        coll.collection(collectionName,  (err, collection) => {
            console.log('Collecting to find data..')
            if(err){
                console.log('Can not collect the collection')
                throw err;
            }
            let query = {animalCategory: category};
            if(category == "*"){
                query = {};
            }
            
            console.log('Finding..', category)
            //Get conditions
            let page = req.query.page;
            //define sort = 1 as default is ascending
            let sort = 1;

            if(!page || page < 0){
                page = 0;
            }

            if(req.query.sort === 'desc'){
                sort = -1;
            }

            collection.find(query).sort({"_id":sort}).skip(page*PAGE_RECORDS).limit(PAGE_RECORDS).toArray((err, res)=>{
                if(err){
                    // throw err;
                    return next(err);
                }else{
                    database.close();
                    return next(err, res);
                }
            })
        })
    });
}

//
// Handle process for request param and query
//
function getAnimal( req, resp){
    console.log('Param: ', req.params, req.query)

    //In special case: list or * will be return all of animal in DB
    let category = req.params.query;
    if(category == "" || category === "list"  || category == "*"){
        category  = "*";
    }

    //Get data follow conditions
    getData(collMongo, category, req, (err, res)=>{
        var response = {
            "code": "200",
            "message": "OK",
            "result": ""
        }

        //In case err: change response code to 404 and error message has returned.
        if(err){
            response.code = 404;
            response.message = err.message();
            
            throw err;
        }else{ //In case successful: Keep code and message. Return query data.
            response.result = res;
        }
        //Send response to client
        resp.send(response);
        return true;
    })
}

module.exports = {
    getAnimal : getAnimal
}


//addNewAnimal();
