console.log("Application starting...");

import express from "express";
import path from "path";
import router from "./routers/index";
import api from "./routers/api";

const app = express();

app.set("view engine","pug");
app.set("views","./views");

// Setup standard and API routers
app.use(router);
app.use(api);

app.use("/public", express.static(path.join(__dirname, "public")));

// Additional fall-through router for 404
app.use(function(req, res) {
  res.status(404);
  res.render("special/404");
});

// Startup node server
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening...");
});