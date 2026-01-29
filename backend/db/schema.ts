import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  visaType: varchar("visa_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Active"), 
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
