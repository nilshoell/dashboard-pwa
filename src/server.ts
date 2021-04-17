console.log("Application starting...");

import express from "express";
import path from "path";
import router from "./routers/index";
import api from "./routers/api";
import sqlite from "sqlite3";
import fs from "fs";

var app = express();

app.set('view engine','pug');
app.set('views','./views');

console.log(path.join(__dirname, "public"));

app.use(router);
app.use(api);

app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 3000, function functionName() {
  console.log("Listening...");
});

const db = new sqlite.Database('./dist/db/dashboard.db', (err:Error) => {
  if (err) {
      console.error("Error opening database " + err.message);
  } else {
      const sql = fs.readFileSync('./src/db/create_tables.sql').toString();
      db.run(sql, (err:Error) => {
          if (err) {
              console.log("Error while creating DB: ", err.message);
          }
      });
  }
});
