import { pgTable, serial, varchar, text, timestamp, } from "drizzle-orm/pg-core";
export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: varchar("title", {
        length: 255,
    }).notNull(),
    description: text("description").notNull(),
    stack: text("stack").notNull(),
    githubUrl: varchar("github_url", {
        length: 500,
    }),
    demoUrl: varchar("demo_url", {
        length: 500,
    }),
    imageUrl: varchar("image_url", {
        length: 500,
    }),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});
