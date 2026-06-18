import { Hono } from "hono";
import { db } from "../db/client.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";


import {
  hashPassword,
  comparePassword,
} from "../utils/hash.js";

import {
  generateToken,
} from "../utils/jwt.js";

const authRoute = new Hono();

authRoute.post("/register", async (c) => {
  const body = await c.req.json();

  const hashedPassword =
    await hashPassword(body.password);

  const user = await db
    .insert(users)
    .values({
      username: body.username,
      password: hashedPassword,
    })
    .returning();

  return c.json({
    message: "Register berhasil",
    data: user[0],
  });
});

authRoute.post("/login", async (c) => {
  const body = await c.req.json();

  const user =
    await db.query.users.findFirst({
      where: eq(
        users.username,
        body.username
      ),
    });

  if (!user) {
    return c.json(
      {
        message: "User tidak ditemukan",
      },
      404
    );
  }

  const valid =
    await comparePassword(
      body.password,
      user.password
    );

  if (!valid) {
    return c.json(
      {
        message: "Password salah",
      },
      401
    );
  }

  const token =
    generateToken(user.id);

  return c.json({
    token,
  });
});

export default authRoute;