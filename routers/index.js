var express = require('express');
var router = express.Router();

router.get('/dashboard', function(req, res) {
  res.render('pages/dashboard', {
  })
});

router.get('/', function(req, res) {
  res.render('pages/home', {
  })
});

module.exports = router;
