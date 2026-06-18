import { createMiddleware } from "hono/factory";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = createMiddleware(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json(
        { message: "Unauthorized" },
        401
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json(
        { message: "Token tidak ditemukan" },
        401
      );
    }

    try {
      const payload = verifyToken(token);

      c.set("user", payload);

      await next();
    } catch {
      return c.json(
        { message: "Token tidak valid" },
        401
      );
    }
  }
);