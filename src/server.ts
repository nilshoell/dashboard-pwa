console.log("Application starting...");

import express from "express";
import path from "path";
import router from "./routers/index";
import api from "./routers/api";

const app = express();

app.set("view engine","pug");
app.set("views","./views");

console.log(path.join(__dirname, "public"));

app.use(router);
app.use(api);

app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening...");
});