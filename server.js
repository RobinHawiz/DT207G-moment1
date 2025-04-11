import "./public/js/env.js";
import express from "express";
import { coursesRoutes } from "./public/js/routes.js";
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const routes = await coursesRoutes();

app.use(routes);

app.listen(port, () => {
  console.log("Server started on port: " + port);
});
