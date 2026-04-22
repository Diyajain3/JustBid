import express from 'express'
import multer from 'multer'
import { analyzeDocument, getMyReports } from '../controllers/document.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Multer configuration (Memory storage for direct processing)
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

router.post('/analyze', protect, upload.single('document'), analyzeDocument)
router.get('/reports', protect, getMyReports)

export default router
