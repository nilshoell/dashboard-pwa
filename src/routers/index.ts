import Router from "express";

const router = Router();

// List of available pages
const routes = [
  {
    id: "home", link:"/", title: "Home", icon: "fa-home",
    help: {title: "Home", content:"The home screen displays your most important KPIs as a slideshow along some quick links to other dashboards."}
  },
  {
    id: "dashboard", link:"/dashboard", title: "Dashboard", icon: "fa-tachometer-alt",
    help: {title: "Dashboard", content:"This page provides a quick overview of the most important KPIs as bars encoding previous, actual, target and forecast values. Use the toggle switch or turn your phone to see a short historical trend, and click on a graphic to get the full details."}
  },
  {
    id: "production", link:"/production", title: "Production Dashboard", icon: "fa-tachometer-alt",
    help: {title: "Production Dashboard", content:"This page provides a quick overview of the most important KPIs as bars encoding previous, actual, target and forecast values. Use the toggle switch or turn your phone to see a short historical trend, and click on a graphic to get the full details."}
  },
  {
    id: "customers", link:"/customers", title: "Customers", icon: "fa-industry",
    help: {title: "Customer Dashboard", content:"This page provides a list of the best and worst customers by sales volume. Click on a graphic to get details."}
  },
  {
    id: "personal", link:"/personal", title: "Personal", icon: "fa-user",
    help: {title: "Personal Dashboard", content:"This page collects your personal performance KPIs."
  }}
];

// Setup standard routes
routes.forEach(page => {
  router.get(page.link, function(req, res) {
    res.render("pages/" + page.id, {routes, page});
  });
});

// Additional KPI page
router.get("/kpi/:id", function(req, res) {
  const params = req.params;
  const page = {
    id: "kpi", link:"/kpi", title: "KPI", icon: "fa-home",
    help: {title: "Help", content:"This is helpful help!"}
  };
  res.render("pages/kpi", {routes, page, params});
});

router.get("/kpi", function(req, res) {
  res.status(400);
  res.render("special/400", {msg: "Please provide a valid KPI ID"});
});

export default router;
