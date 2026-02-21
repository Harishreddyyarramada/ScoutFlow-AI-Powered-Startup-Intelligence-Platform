import express from 'express';
import cors from 'cors';
import enrichRouter from './routes/enrich';

const app = express();
const PORT = process.env.VITE_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', enrichRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});