import express from "express";
import { fetchUserTransactions } from "../controllers/transactionsController";

const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  try {
    const result = await fetchUserTransactions(req, res);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
