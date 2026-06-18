import { Hono } from "hono";
import { db } from "../db/client.js";
import { experiences } from "../db/schema/experiences.js";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.js";

const experiencesRoute = new Hono();

experiencesRoute.get("/", async (c) => {
  const data = await db.select().from(experiences);
  return c.json(data);
});

experiencesRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const experience = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, id));

  if (!experience.length) {
    return c.json({ message: "Experience tidak ditemukan" }, 404);
  }

  return c.json(experience[0]);
});

experiencesRoute.post("/", authMiddleware, async (c) => {
  const body = await c.req.json();

  const created = await db
    .insert(experiences)
    .values({
      title: body.title,
      organization: body.organization,
      description: body.description,
      type: body.type ?? 'work',
      skills: Array.isArray(body.skills) ? body.skills : [],
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    })
    .returning();

  return c.json(
    {
      message: "Experience berhasil dibuat",
      data: created[0],
    },
    201
  );
});

experiencesRoute.put("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const updated = await db
    .update(experiences)
    .set({
      title: body.title,
      organization: body.organization,
      description: body.description,
      type: body.type ?? 'work',
      skills: Array.isArray(body.skills) ? body.skills : [],
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    })
    .where(eq(experiences.id, id))
    .returning();

  if (!updated.length) {
    return c.json({ message: "Experience tidak ditemukan" }, 404);
  }

  return c.json({ message: "Experience berhasil diupdate", data: updated[0] });
});

experiencesRoute.delete("/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));

  await db.delete(experiences).where(eq(experiences.id, id));

  return c.json({ message: "Experience berhasil dihapus" });
});

export default experiencesRoute;

