import Router from "express";

const router = Router();

const routes = [
  {id: "home", link:"/", title: "Home", icon: "fa-home"},
  {id: "dashboard", link:"/dashboard", title: "Dashboard", icon: "fa-tachometer-alt"},
  {id: "customers", link:"/customers", title: "Customers", icon: "fa-industry"},
  {id: "projects", link:"/projects", title: "Projects", icon: "fa-project-diagram"},
  {id: "personal", link:"/personal", title: "Personal", icon: "fa-user"}
]

routes.forEach(route => {
  router.get(route.link, function(req, res) {
    res.render('pages/' + route.id, {routes, route});
  });
});

// router.get('/dashboard', function(req, res) {
//   res.render('pages/dashboard', {
//   })
// });

// router.get('/', function(req, res) {
//   res.render('pages/home', {
//   })
// });

export default router;
