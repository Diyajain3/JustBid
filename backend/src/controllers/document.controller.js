import prisma from '../config/db.js'
import Groq from 'groq-sdk'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY || ''
})

export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document uploaded' })
    }

    // 1. Extract text from PDF
    const dataBuffer = req.file.buffer
    const data = await pdf(dataBuffer)
    const text = data.text

    if (!text || text.length < 50) {
      return res.status(400).json({ message: 'Document contains insufficient text for analysis' })
    }

    // 2. AI Analysis using Groq
    const prompt = `
      You are an expert Tender Analyst. Analyze the following tender document text and extract:
      1. Technical Requirements (List them clearly)
      2. Critical Deadlines (Submission, Clarification, etc.)
      3. Estimated Budget or Currency (if mentioned)
      4. A brief summary of the project.

      Format the response as JSON with keys: "requirements" (array), "deadlines" (array), "budget" (string), "summary" (string).

      Document Text:
      ${text.substring(0, 15000)} 
    `

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(completion.choices[0].message.content)

    // 3. Store in Database
    const report = await prisma.analysisReport.create({
      data: {
        userId: req.user.id,
        filename: req.file.originalname,
        requirements: result.requirements || [],
        deadlines: result.deadlines || [],
        budget: result.budget || 'Not specified',
        summary: result.summary || 'No summary available'
      }
    })

    res.status(200).json({
      success: true,
      data: report
    })

  } catch (error) {
    console.error('Document Analysis Error:', error)
    res.status(500).json({ message: 'Internal Server Error during analysis' })
  }
}

export const getMyReports = async (req, res) => {
  try {
    const reports = await prisma.analysisReport.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json({ success: true, data: reports })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports' })
  }
}
