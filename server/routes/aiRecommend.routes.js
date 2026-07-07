import express from 'express';
import { getAIRecommendations } from '../controllers/aiRecommend.controller.js';

const router = express.Router();

router.post('/', getAIRecommendations);

export default router;
