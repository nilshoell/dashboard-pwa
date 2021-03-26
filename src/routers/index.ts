import Router from "express";

var router = Router();

router.get('/dashboard', function(req, res) {
  res.render('pages/dashboard', {
  })
});

router.get('/', function(req, res) {
  res.render('pages/home', {
  })
});

export default router;
