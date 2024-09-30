import express from "express";
import axios from "axios";
import pool from "../database";
import { Request, Response } from "express";

const router = express.Router();

// Endpoint for Spending Forecast
router.post("/forecast", async (req: Request, res: Response): Promise<void> => {
  const userId = req.body.userId;
  if (!userId || isNaN(userId)) {
    res.status(400).json({ error: "Invalid or missing userId." });
    return;
  }

  try {
    const transactionsResult = await pool.query(
      "SELECT id, user_id, date, category, amount, description FROM transactions WHERE user_id = $1 ORDER BY date ASC",
      [userId]
    );
    const transactions = transactionsResult.rows;

    // Call AI Service
    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/forecast`,
      {
        transactions,
        periods: 6, // Forecast periods (months)
      }
    );

    res.status(200).json(aiResponse.data);
  } catch (error: any) {
    console.error("Error fetching forecast:", error);
    res.status(500).json({ error: "Failed to fetch forecast." });
  }
});

// Endpoint for Anomaly Detection
router.post(
  "/anomalies",
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.body.userId;
    if (!userId || isNaN(userId)) {
      res.status(400).json({ error: "Invalid or missing userId." });
      return;
    }

    try {
      const transactionsResult = await pool.query(
        "SELECT id, user_id, date, category, amount, description FROM transactions WHERE user_id = $1 ORDER BY date ASC",
        [userId]
      );
      const transactions = transactionsResult.rows;

      // Call AI Service
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL}/anomalies`,
        {
          transactions,
        }
      );

      res.status(200).json(aiResponse.data);
    } catch (error: any) {
      console.error("Error detecting anomalies:", error);
      res.status(500).json({ error: "Failed to detect anomalies." });
    }
  }
);

export default router;
