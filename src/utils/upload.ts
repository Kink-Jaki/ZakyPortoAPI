import { mkdir, rename, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomUUID } from "node:crypto";

export const UPLOADS_DIR = join(process.cwd(), "uploads");

function safeExt(filename: string) {
  const ext = extname(filename || "");
  return ext && ext.length <= 10 ? ext.toLowerCase() : "";
}

export async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

export type SavedUpload = {
  /** relative url path e.g. /uploads/projects/<name>.png */
  publicUrl: string;
  /** absolute file system path */
  filePath: string;
};

/**
 * Saves a file Buffer into uploads/projects with unique name.
 * @param fileBuffer file content
 * @param originalName original filename from multipart
 */
export async function saveProjectImageFromBuffer(
  fileBuffer: Buffer,
  originalName: string
): Promise<SavedUpload> {
  const projectsDir = join(UPLOADS_DIR, "projects");
  await ensureDir(projectsDir);

  const ext = safeExt(originalName);
  const name = `${Date.now()}-${randomUUID()}${ext || ".png"}`;
  const filePath = join(projectsDir, name);

  await writeFile(filePath, fileBuffer);

  return {
    publicUrl: `/uploads/projects/${name}`,
    filePath,
  };
}

