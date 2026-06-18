import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  organization: varchar("organization", {
    length: 255,
  }).notNull(),

  description: text("description"),

  // work | education
  type: varchar("type", { length: 50 }).notNull(),

  // stored as jsonb array of strings
  skills: jsonb("skills").$type<string[]>().notNull().default([]),

  startDate: timestamp("start_date"),

  endDate: timestamp("end_date"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
