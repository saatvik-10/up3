import express from 'express';
import userRoutes from './routes/user';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)

app.use('/api/v1', userRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
