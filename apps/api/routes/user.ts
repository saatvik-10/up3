import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { prismaClient } from 'db/client';

const route = Router();

route.post('/website', authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;

  const data = await prismaClient.website.create({
    data: {
      userId,
      url,
    },
  });
  res.json({
    id: data.id,
  });
});

route.get('/website/status', authMiddleware, async (req, res) => {});

route.get('/websites', authMiddleware, async (req, res) => {});

route.delete('/website', authMiddleware, async (req, res) => {});

export default route;
