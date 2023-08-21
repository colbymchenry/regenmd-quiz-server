import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import preview from './preview';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/preview', preview);
// router.use('/emojis', emojis);
// router.use('/submitquiz', submitquiz);

export default router;
