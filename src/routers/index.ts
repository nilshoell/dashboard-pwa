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
    id: "production", link:"/production", title: "Production", icon: "fa-industry",
    help: {title: "Production Dashboard", content:"This page provides a quick overview of the most important KPIs as bars encoding previous, actual, target and forecast values. Use the toggle switch or turn your phone to see a short historical trend, and click on a graphic to get the full details."}
  },
  {
    id: "customers", link:"/customers", title: "Customers", icon: "fa-user-tie",
    help: {title: "Customer Dashboard", content:"This page provides a list of the best and worst customers by sales volume. Click on a graphic to get details."}
  },
  {
    id: "personal", link:"/personal", title: "Personal", icon: "fa-id-card",
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
    id: params.id, link:"/kpi", title: "KPI", icon: "fa-home",
    help: {title: "KPI Overview", content:"This page provides a detailed overview of a single KPI."}
  };
  res.render("pages/kpi", {routes, page, params});
});

router.get("/kpi", function(req, res) {
  res.status(400);
  res.render("special/400", {msg: "Please provide a valid KPI ID"});
});

// Additional Customer page
router.get("/partner/:id", function(req, res) {
  const params = req.params;
  const page = {
    id: params.id, link:"/partner", title: "Customer", icon: "fa-home",
    help: {title: "Customer Overview", content:"This page provides a detailed overview of a single Customer."}
  };
  res.render("pages/partner", {routes, page, params});
});

router.get("/partner", function(req, res) {
  res.status(400);
  res.render("special/400", {msg: "Please provide a valid Partner ID"});
});

// Show the offline page
router.get("/offline.html", function(req, res) {
  res.render("special/offline");
});


export default router;
