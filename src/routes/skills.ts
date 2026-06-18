import { Hono } from "hono";
import { db } from "../db/client.js";
import { skills } from "../db/schema/skills.js";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.js";

const skillsRoute = new Hono();

skillsRoute.get("/", async (c) => {
  const data = await db.select().from(skills);
  return c.json(data);
});

skillsRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const skill = await db.select().from(skills).where(eq(skills.id, id));

  if (!skill.length) {
    return c.json({ message: "Skill tidak ditemukan" }, 404);
  }

  return c.json(skill[0]);
});

skillsRoute.post("/", authMiddleware, async (c) => {
  const body = await c.req.json();

  const created = await db
    .insert(skills)
    .values({
      name: body.name,
      category: body.category,
    })
    .returning();

  return c.json(
    {
      message: "Skill berhasil dibuat",
      data: created[0],
    },
    201
  );
});

skillsRoute.put("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const updated = await db
    .update(skills)
    .set({
      name: body.name,
      category: body.category,
    })
    .where(eq(skills.id, id))
    .returning();

  if (!updated.length) {
    return c.json({ message: "Skill tidak ditemukan" }, 404);
  }

  return c.json({ message: "Skill berhasil diupdate", data: updated[0] });
});

skillsRoute.delete("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));

  await db.delete(skills).where(eq(skills.id, id));

  return c.json({ message: "Skill berhasil dihapus" });
});

export default skillsRoute;

