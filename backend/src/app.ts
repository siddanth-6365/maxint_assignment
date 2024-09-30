import express from 'express';
import cors from 'cors';
import transactionsRoutes from './routes/transactionsRoutes';
import aiRoutes from './routes/aiRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionsRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
