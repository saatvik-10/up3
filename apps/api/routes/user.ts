import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { prismaClient } from 'db/client';

const route = Router();

route.post('/website', authMiddleware, async (req, res) => {
  const userId = req.userId as string;
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

route.get('/website/status', authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const userId = req.userId as string;

  const data = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });
  res.json(data);
});

route.get('/websites', authMiddleware, async (req, res) => {
  const userId = req.userId as string;

  const websites = await prismaClient.website.findMany({
    where: {
      userId,
      disabled: false,
    },
  });

  res.json({
    websites,
  });
});

route.delete('/website', authMiddleware, async (req, res) => {
  const websiteId = req.body.websiteId as string;
  const userId = req.userId as string;

  await prismaClient.website.update({
    where: {
      id: websiteId,
      userId,
    },
    data: {
      disabled: true,
    },
  });

  res.json({
    message: 'Website deleted successfully',
  });
});

export default route;
