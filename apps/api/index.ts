import express from 'express';
import userRoutes from './routes/user';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use('/api/v1', userRoutes);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
