console.log("Application starting...");

import express from "express";
import path from "path";
import router from "./routers/index";

var app = express();

app.set('view engine','pug');
app.set('views','./views');

console.log(path.join(__dirname, "public"));

app.use(router);

app.use("/public", express.static(path.join(__dirname, "public")));


app.listen(process.env.PORT || 3000, function functionName() {
  console.log("Listening...");
})
