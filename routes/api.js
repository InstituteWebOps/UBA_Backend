var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var db_name = "UBA_DB";
var table_list = ["location","data"];

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json({RESULT : "UBA Api Service",STATUS : "Working",DB_NAME : db_name,TABLES_WORKING : table_list});
});

router.get('/read/:id', function(req, res, next) {
    if (table_list.indexOf(req.params.id)+1){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.id).find({}).toArray(function(error, result) {
                if (error) {res.json(error);}
                else{
                    res.json(result);
                    db.close();
                }
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.post('/create/:id', function(req, res, next) {
    if (table_list.indexOf(req.params.id)+1){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.id).insertOne(JSON.parse(req.body.data), function(error, result) {
                if (error) {res.json(error);}
                else{
                    res.json(result);
                    db.close();
                }

            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.post('/create_many/:id', function(req, res, next) {
    if (table_list.indexOf(req.params.id)+1){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.id).insertMany(JSON.parse(req.body.data), function(error, result) {
                if (error) {res.json(error);}
                else{
                    console.log(req.body.data);
                    res.json(result);
                    db.close();
                }

            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});



module.exports = router;