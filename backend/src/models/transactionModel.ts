import pool from '../database';

interface Transaction {
  id: number;
  user_id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
  created_at: string;
}

export const getUserTransactions = async (userId: number): Promise<Transaction[]> => {
  const res = await pool.query(
    'SELECT id, user_id, date, category, amount, description, created_at FROM transactions WHERE user_id = $1 ORDER BY date ASC',
    [userId]
  );
  return res.rows;
};
