import express from 'express';
import { 
  getTenders, 
  getTenderById, 
  getMatchedTendersFeed, 
  ingestTenderFromWorker, 
  getMissingDetails, 
  batchUpdateDetails,
  getSavedBids,
  saveTenderAsBid,
  deleteSavedBid,
  reparseTenders,
  getTenderStats
} from '../controllers/tender.controller.js';
import { protect, workerProtect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/missing-details', getMissingDetails);
router.put('/batch-update', workerProtect, batchUpdateDetails);
router.get('/', getTenders);
router.get('/feed', protect, getMatchedTendersFeed);
router.get('/stats', protect, getTenderStats);
router.get('/saved', protect, getSavedBids);
router.post('/save/:id', protect, saveTenderAsBid);
router.delete('/save/:id', protect, deleteSavedBid);
router.post('/reparse', protect, reparseTenders);
router.post('/ingest', workerProtect, ingestTenderFromWorker);
router.get('/:id', getTenderById);

export default router;
