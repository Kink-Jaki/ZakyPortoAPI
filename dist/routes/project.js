import { Hono } from "hono";
import { db } from "../db/client.js";
import { projects } from "../db/schema/projects.js";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.js";
import { saveProjectImageFromBuffer } from "../utils/upload.js";
const projectRoute = new Hono();
projectRoute.get("/", async (c) => {
    const data = await db.select().from(projects);
    return c.json(data);
});
projectRoute.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));
    if (!project.length) {
        return c.json({ message: "Project tidak ditemukan" }, 404);
    }
    return c.json(project[0]);
});
function asFormData(body) {
    if (body instanceof FormData)
        return body;
    // Hono parseBody for multipart usually returns a FormData-like object,
    // but guard defensively.
    if (body && typeof body === "object" && "get" in body) {
        return body;
    }
    // Return empty FormData to avoid crashes
    return new FormData();
}
function getTextField(form, key) {
    const v = form.get(key);
    if (typeof v === "string")
        return v;
    return null;
}
async function parseImageFile(form) {
    const image = form.get("image");
    // In some runtimes it may not be File; support Blob as fallback.
    const isFileLike = typeof image?.arrayBuffer === "function" &&
        typeof image?.name === "string";
    if (!image || !(image instanceof Blob) || !isFileLike)
        return null;
    const arrayBuffer = await image.arrayBuffer();
    const originalName = image.name;
    return {
        buffer: Buffer.from(arrayBuffer),
        originalName,
    };
}
projectRoute.post("/", authMiddleware, async (c) => {
    // Multipart handling in Hono: use formData() (more reliable than parseBody())
    // so fields and files are consistently available.
    const dataForm = await c.req.formData();
    let imageUpload = null;
    try {
        imageUpload = await parseImageFile(dataForm);
    }
    catch (e) {
        return c.json({ message: "Gagal membaca image upload" }, 400);
    }
    const title = getTextField(dataForm, "title") ?? "";
    const description = getTextField(dataForm, "description") ?? "";
    const githubUrl = getTextField(dataForm, "githubUrl");
    const demoUrl = getTextField(dataForm, "demoUrl");
    const techStack = getTextField(dataForm, "techStack") ?? "";
    if (!title || !description || !techStack) {
        return c.json({ message: "title, description, techStack wajib diisi" }, 400);
    }
    let imageUrl = null;
    if (imageUpload) {
        const saved = await saveProjectImageFromBuffer(imageUpload.buffer, imageUpload.originalName);
        imageUrl = saved.publicUrl;
    }
    const project = await db
        .insert(projects)
        .values({
        title,
        description,
        imageUrl,
        githubUrl: githubUrl ?? null,
        demoUrl: demoUrl ?? null,
        stack: techStack,
    })
        .returning();
    return c.json({
        message: "Project berhasil dibuat",
        data: project[0],
    }, 201);
});
projectRoute.put("/:id", authMiddleware, async (c) => {
    const id = Number(c.req.param("id"));
    const dataForm = await c.req.formData();
    const title = getTextField(dataForm, "title") ?? "";
    const description = getTextField(dataForm, "description") ?? "";
    const githubUrl = getTextField(dataForm, "githubUrl");
    const demoUrl = getTextField(dataForm, "demoUrl");
    const techStack = getTextField(dataForm, "techStack") ?? "";
    let imageUpload = null;
    try {
        imageUpload = await parseImageFile(dataForm);
    }
    catch (e) {
        return c.json({ message: "Gagal membaca image upload" }, 400);
    }
    if (!title || !description || !techStack) {
        return c.json({ message: "title, description, techStack wajib diisi" }, 400);
    }
    // Update only imageUrl if file was provided
    const existing = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));
    if (!existing.length) {
        return c.json({ message: "Project tidak ditemukan" }, 404);
    }
    let nextImageUrl = existing[0].imageUrl;
    if (imageUpload) {
        const saved = await saveProjectImageFromBuffer(imageUpload.buffer, imageUpload.originalName);
        nextImageUrl = saved.publicUrl;
    }
    const updated = await db
        .update(projects)
        .set({
        title,
        description,
        imageUrl: nextImageUrl,
        githubUrl: githubUrl ?? null,
        demoUrl: demoUrl ?? null,
        stack: techStack,
    })
        .where(eq(projects.id, id))
        .returning();
    return c.json({
        message: "Project berhasil diupdate",
        data: updated[0],
    });
});
projectRoute.delete("/:id", authMiddleware, async (c) => {
    const id = Number(c.req.param("id"));
    await db.delete(projects).where(eq(projects.id, id));
    return c.json({
        message: "Project berhasil dihapus",
    });
});
export default projectRoute;
