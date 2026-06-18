import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoute from "./routes/auth";
import projectRoute from "./routes/project";
import skillsRoute from "./routes/skills";
import experiencesRoute from "./routes/experiences";
import { cors } from "hono/cors";
import { serveStatic } from "hono/serve-static";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = new Hono();
app.use("*", cors());

// Serve uploaded files
// Use a stable absolute path based on this file location (not process.cwd()).
// Exposes: /uploads/*
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsRoot = join(__dirname, "../uploads");

app.get(
  "/uploads/*",
  serveStatic({
    root: uploadsRoot,
    // NOTE: hono/serve-static in this project expects `getContent`.
    // We provide it to fix runtime crash: `TypeError: getContent is not a function`.
    getContent: async (filePath: string) => {
      const fs = await import("node:fs/promises");
      try {
        const data = await fs.readFile(filePath);
        // Return a Response so hono can stream correctly.
        return new Response(data);
      } catch {
        return null;
      }
    },
    rewriteRequestPath: (path) => path.replace(/^\/uploads\//, ""),
  })
);




app.route("/auth", authRoute);
app.route("/project", projectRoute);
app.route("/skills", skillsRoute);
app.route("/experiences", experiencesRoute);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve({
  fetch: app.fetch,
  port: 3000,
});



