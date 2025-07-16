import { Router } from 'express';

const route = Router();

route.post('/website', async (req, res) => {});

route.get('/website/status', async (req, res) => {});

route.get('/websites', async (req, res) => {});

route.delete('/website', async (req, res) => {});

export default route;
