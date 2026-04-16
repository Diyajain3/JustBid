import express from 'express';
import { addBookmark, removeBookmark, getBookmarks } from '../controllers/bookmark.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, addBookmark);
router.delete('/:tenderId', protect, removeBookmark);
router.get('/', protect, getBookmarks);

export default router;
