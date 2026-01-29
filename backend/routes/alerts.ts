import express, { Request, Response } from "express";
import { db } from "../index";
import { alerts } from "../db/schema";
import { eq, and, sql, desc, ilike } from "drizzle-orm";
import { validateAlert, validateUpdateAlert } from "../middleware/validator";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { country, status, page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    if (country) {
      conditions.push(ilike(alerts.country, `%${country}%`));
    }
    if (status) {
      conditions.push(eq(alerts.status, status as string));
    }

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(alerts)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = Number(countResult[0]?.count || 0);

    let query = db.select().from(alerts);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(alerts.createdAt));

    res.status(200).json({
      data: results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

router.post("/", validateAlert, async (req: Request, res: Response) => {
  try {
    const { country, city, visaType, status = "Active" } = req.body;

    const [newAlert] = await db
      .insert(alerts)
      .values({
        country,
        city,
        visaType,
        status,
      })
      .returning();

    res.status(201).json({
      message: "Alert created successfully",
      data: newAlert,
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

router.put("/:id", validateUpdateAlert, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alertId = parseInt(id as string);

    if (isNaN(alertId)) {
      res.status(400).json({ error: "Invalid alert ID" });
      return;
    }

    const existing = await db
      .select()
      .from(alerts)
      .where(eq(alerts.id, alertId))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    const [updatedAlert] = await db
      .update(alerts)
      .set(req.body)
      .where(eq(alerts.id, alertId))
      .returning();

    res.status(200).json({
      message: "Alert updated successfully",
      data: updatedAlert,
    });
  } catch (error) {
    console.error("Error updating alert:", error);
    res.status(500).json({ error: "Failed to update alert" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alertId = parseInt(id as string);

    if (isNaN(alertId)) {
      res.status(400).json({ error: "Invalid alert ID" });
      return;
    }

    const existing = await db
      .select()
      .from(alerts)
      .where(eq(alerts.id, alertId))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    await db.delete(alerts).where(eq(alerts.id, alertId));

    res.status(200).json({
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

export default router;
