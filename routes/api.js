var express = require('express');
var router = express.Router();
var json2xls = require('json2xls');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
// var db_name = "UBA_DB";
var url = "mongodb://joeydash:joeydash@ds135790.mlab.com:35790/joeydash";
var db_name = "joeydash";
var collection_list = ["data"];
var contains = function(needle) {
    var findNaN = needle !== needle;
    var indexOf;
    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;
            for(i = 0; i < this.length; i++) {
                var item = this[i];
                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json({RESULT : "UBA Api Service",STATUS : "Working",DB_NAME : db_name,TABLES_WORKING : collection_list});
});
router.get('/read', function(req, res, next) {
    res.json({TABLES_WORKING : collection_list});
});

router.get('/read/:collection_name/:data_id', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        ObjectId = require('mongodb').ObjectID;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).findOne({"_id" : new ObjectId(req.params.data_id)}, function(error, result) {
                if (error) res.json(error);
                res.json(result);
                db.close();
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.get('/delete/:collection_name/:data_id', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        ObjectId = require('mongodb').ObjectID;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).deleteOne({"_id" : new ObjectId(req.params.data_id)}, function(error, result) {
                if (error) res.json(error);
                res.json(result);
                db.close();
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});

router.get('/read/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).find({}).toArray(function(error, result) {
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
router.get('/read_mini/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).find({}).project({submitted_by: 1}).toArray(function(error, result) {
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
router.get('/read/:collection_name/:skip/:limit', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).find({}).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit)).toArray(function(error, result) {
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

router.get('/get_numbers/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).count({}, function(error, numOfDocs) {
                if (error) res.json(error);
                res.json({"number_of_data":numOfDocs});
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.post('/create/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).insertOne(JSON.parse(req.body.data), function(error, result) {
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
router.post('/update/:collection_name/:data_id', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        ObjectId = require('mongodb').ObjectID;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).updateOne({"_id" : new ObjectId(req.params.data_id)},{$set:JSON.parse(req.body.data)}, function(error, result) {
                if (error) res.json(error);
                res.json(result);
                db.close();
            });
        });
    }else {
        res.json({
            RESULT : "No Table Found",
            RESULT_CODE : 1081
        })
    }
});
router.post('/create_many/:collection_name', function(req, res, next) {
    if (contains.call(collection_list,req.params.collection_name)){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(req.params.collection_name).insertMany(JSON.parse(req.body.data), function(error, result) {
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

router.get('/get_xlxs_full', function(req, res, next) {
    if (contains.call(collection_list,"data")){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection("data").find({}).toArray(function(error, result) {
                if (error) {res.json(error);}
                else{
                    var xls = json2xls(result);
                    fs.writeFileSync('./public/data/full_data.xlsx', xls, 'binary');
                    res.redirect("/data/full_data.xlsx");
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


router.get('/get_xlsx_ND', function(req, res, next) {
    if (contains.call(collection_list,"data")){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection("data").find({}).toArray(function(error, result) {
                if (error) {res.json(error);}
                else{
                    var xls = json2xls(create_ND_json(result));
                    fs.writeFileSync('./public/data/ND_data.xlsx', xls, 'binary');
                    res.redirect("/data/ND_data.xlsx");
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


function create_ND_json(data) {
    var ND_data = [];
    for (var i = data.length - 1; i >= 0; i--) {
        var element = {};
        jsonConcat(element,data[i].respondentProfileModal);
        jsonConcat(element,data[i].locationModal);
        jsonConcat(element,data[i].generalHouseholdInformationModal);
        jsonConcat(element,data[i].agriculturalInputsModal);
        jsonConcat(element,data[i].landHoldingInformation);
        jsonConcat(element,data[i].livestockNumbersModal);
        jsonConcat(element,data[i].sourceOfWaterModal);
        jsonConcat(element,data[i].majorProblemsInVillageModal);
        jsonConcat(element,data[i].migrationStatusInAFamilyModal);
        jsonConcat(element,data[i].informationOfGovtSchemesModal);
        ND_data.push(element);
    }
    return ND_data;
}
function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}




module.exports = router;