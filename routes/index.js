var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/show_each_data/:_id', function(req, res, next) {
    res.render('show_each_data',{_id: req.params._id});
});
router.get('/see_all/', function(req, res, next) {
    res.render('see_all');
});

module.exports = router;
