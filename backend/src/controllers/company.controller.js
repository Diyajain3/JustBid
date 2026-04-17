import prisma from '../config/db.js';
import { matchCompanyToAllTenders } from '../services/match.service.js';

export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, industry, cpvCodes, keywords, location, minBudget, maxBudget } = req.body;

    // MongoDB arrays natively handled directly via Prisma
    const company = await prisma.company.upsert({
      where: { userId },
      update: { name, industry, location, minBudget: parseFloat(minBudget) || null, maxBudget: parseFloat(maxBudget) || null, cpvCodes: cpvCodes || [], keywords: keywords || [] },
      create: { userId, name, industry, location, minBudget: parseFloat(minBudget) || null, maxBudget: parseFloat(maxBudget) || null, cpvCodes: cpvCodes || [], keywords: keywords || [] },
    });

    // Fire off async matching in background
    matchCompanyToAllTenders(company.id).catch(err => console.error("Matching error:", err));

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating company profile' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await prisma.company.findUnique({
      where: { userId }
    });

    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching company profile' });
  }
};
