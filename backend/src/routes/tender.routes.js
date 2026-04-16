import express from 'express';
import { getTenders, getTenderById, getMatchedTendersFeed, ingestTenderFromWorker, getMissingDetails, batchUpdateDetails } from '../controllers/tender.controller.js';
import { protect, workerProtect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/missing-details', getMissingDetails);
router.put('/batch-update', workerProtect, batchUpdateDetails);
router.get('/', getTenders);
router.get('/feed', protect, getMatchedTendersFeed);
router.post('/ingest', workerProtect, ingestTenderFromWorker);
router.get('/:id', getTenderById);

export default router;
