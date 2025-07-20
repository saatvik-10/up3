import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/api/v1', userRoutes);

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
