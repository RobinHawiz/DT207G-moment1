import { Router } from "express";
import { connectToDatabase } from "./db.js";
import sql from "mssql";
/**
 * Factory function to create course-related routes.
 * Also connects to db and communicates with it and dynamically changes stuff on the webpage.
 * @returns Express router
 */
export async function coursesRoutes() {
  const pool = ""; // await connectToDatabase();
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const pool = await connectToDatabase();
      const result = await new sql.Request(pool).execute("spCourses_GetAll");
      const courses = result.recordset ?? [];
      res.render("index", { courses });
    } catch (err) {
      res.status(500).send(`
        <pre>
        Database Error:
        ${err.message}
  
        stack:
        ${err.stack}
        </pre>
      `);
    }
  });

  // This route will delete data and has to recieve a post request because HTML Forms don't support delete methods.
  router.post("/", async (req, res) => {
    // Delete course from db.
    try {
      const { id } = req.body;
      const request = new sql.Request(pool);
      request.input("id", sql.Int, id);
      await request.execute("spCourses_DeleteById");
    } catch (error) {
      console.error("Database deletion error:", error);
    }
    // Rerender page with updated data from db.
    const result = await new sql.Request(pool).execute("spCourses_GetAll");
    const courses = result.recordset ?? [];
    res.render("index", { courses });
  });

  router.get("/add-course", (_req, res) => {
    res.render("add-course/index", { errors: [] });
  });

  router.post("/add-course", async (req, res) => {
    // Read form data.
    const { courseCode, courseName, progression, syllabus } = req.body;

    // Validate form data.
    let errors = [];

    if (courseCode === "") {
      errors.push("Du måste ange en kurskod!");
    } else if (courseCode > 6) {
      errors.push("Kurskoden får högst vara 6 karaktärer lång!");
    }
    if (courseName === "") {
      errors.push("Du måste ange ett kursnamn!");
    } else if (courseName > 50) {
      errors.push("Kurskoden får högst vara 50 karaktärer lång!");
    }
    if (!["A", "B", "C"].includes(progression)) {
      errors.push(
        "Progression måste vara en av följande progressionsnivåer: A, B eller C!"
      );
    }
    if (syllabus === "") {
      errors.push("Du måste ange en kursplan!");
    } else if (syllabus > 2083) {
      errors.push("Kursplanen får högst vara 2083 karaktärer lång!");
    }
    // If any form data was invalid, rerender the page with the error messages.
    if (errors.length > 0) {
      res.render("add-course/index", { errors });
    }
    // If the form data is valid, insert it into db and Redirect user to homepage.
    else {
      try {
        const request = new sql.Request(pool);
        request.input("courseCode", sql.NVarChar, courseCode);
        request.input("courseName", sql.NVarChar, courseName);
        request.input("syllabus", sql.NVarChar, syllabus);
        request.input("progression", sql.Char, progression);
        await request.execute("spCourses_Insert");
      } catch (error) {
        console.error("Database insertion error:", error);
      }
      res.redirect("/");
    }
  });

  router.get("/about", (_req, res) => {
    res.render("about/index");
  });

  return router;
}
