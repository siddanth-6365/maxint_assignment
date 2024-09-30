import { Request, Response } from 'express';
import { getUserTransactions } from '../models/transactionModel';

export const fetchUserTransactions = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  try {
    const transactions = await getUserTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
};
