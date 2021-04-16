import Router from "express";

const router = Router();

// List of available pages
const routes = [
  {id: "home", link:"/", title: "Home", icon: "fa-home"},
  {id: "dashboard", link:"/dashboard", title: "Dashboard", icon: "fa-tachometer-alt"},
  {id: "customers", link:"/customers", title: "Customers", icon: "fa-industry"},
  {id: "projects", link:"/projects", title: "Projects", icon: "fa-project-diagram"},
  {id: "personal", link:"/personal", title: "Personal", icon: "fa-user"}
]

// Setup standard routes
routes.forEach(route => {
  router.get(route.link, function(req, res) {
    res.render('pages/' + route.id, {routes, route});
  });
});

// Additional KPI page
router.get('/kpi/:id', function(req, res) {
  const params = req.params;
  const route = {id: "kpi", link:"/kpi", title: "KPI", icon: "fa-home"};
  res.render('pages/kpi', {routes, route, params});
});

router.get('/kpi', function(req, res) {
  res.status(400);
  res.render('special/400', {msg: "Please provide a valid KPI ID"});
});

// router.use(function(req, res) {
//   res.status(404);
//   res.render('special/404');
// });


export default router;
