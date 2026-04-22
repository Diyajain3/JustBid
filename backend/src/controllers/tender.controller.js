import prisma from '../config/db.js';
import { matchAllCompaniesToNewTenders } from '../services/match.service.js';

export const getTenders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tenders, total] = await Promise.all([
      prisma.tender.findMany({
        skip,
        take: limit,
        orderBy: [
          { publicationDate: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.tender.count()
    ]);

    res.json({
      tenders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
     console.error(error);
    res.status(500).json({ message: 'Server error fetching tenders' });
  }
};

const stripTags = (text) => {
  if (!text) return "";
  // Remove HTML tags, replace with space
  let clean = text.replace(/<[^>]*>?/gm, ' ');
  // Handle common entities
  clean = clean.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  // Normalize double spaces
  return clean.replace(/\s\s+/g, ' ').trim();
};

const findBudgetInText = (text) => {
  if (!text) return null;
  const regex = /(?:Budget|Value|Price|Total|CHF|USD|\$)\D*([\d\s'\.,]{4,})/i;
  const match = text.match(regex);
  if (match) {
    const raw = match[1].replace(/[\s'\.]/g, '').split(',')[0];
    if (/^\d+$/.test(raw) && raw.length > 3) return parseInt(raw);
  }
  return null;
};

const findLocationInText = (text) => {
  if (!text) return null;
  const cantons = ["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"];
  const regex = new RegExp(`\\b(${cantons.join('|')})\\b`);
  const match = text.match(regex);
  return match ? match[0] : null;
};

export const getTenderById = async (req, res) => {
  try {
    const tenderId = req.params.id; // Removed parseInt for Mongo ObjectId
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId }
    });

    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    res.json(tender);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching test tender' });
  }
};

export const getMatchedTendersFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await prisma.company.findUnique({ where: { userId } });

    if (!company) {
      return res.status(400).json({ message: 'Complete company profile first' });
    }

    const matches = await prisma.match.findMany({
      where: { companyId: company.id },
      include: { tender: true },
      orderBy: { score: 'desc' },
      take: 20
    });

    const feed = matches.map(m => ({
      ...m.tender,
      matchScore: m.score,
      matchReasons: m.reasons // Natively maps directly from MongoDB array!
    }));

    res.json(feed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tender feed' });
  }
};

export const ingestTenderFromWorker = async (req, res) => {
  try {
    const payload = req.body;
    let tendersArray = [];

    if (Array.isArray(payload)) {
      tendersArray = payload;
    } else if (payload && Array.isArray(payload.tenders)) {
      tendersArray = payload.tenders;
    } else {
      tendersArray = [payload];
    }

    const upsertPromises = tendersArray.map(async (tenderData) => {
      // Map to strict Prisma model
      const externalId = tenderData.external_id || tenderData.externalId;
      if (!externalId) return null;

      // Extract raw titles
      let title = "Untitled Tender";
      if (typeof tenderData.title === 'string') {
        title = tenderData.title;
      } else if (typeof tenderData.title === 'object' && tenderData.title !== null) {
        title = tenderData.title[tenderData.language] || tenderData.title['en'] || tenderData.title['de'] || "Untitled Tender";
      }

      // Extract and clean description
      let description = tenderData.description || null;
      if (typeof description === 'object' && description !== null) {
        description = description[tenderData.language] || description['en'] || description['de'];
      }
      description = stripTags(description);

      const budgetFromText = findBudgetInText(description);
      const budget = tenderData.budget || budgetFromText || null;

      const locationFromText = findLocationInText(description);
      const location = tenderData.region || tenderData.location || locationFromText || null;

      // Prepare date payload
      const deadline = tenderData.deadline ? new Date(tenderData.deadline) : null;
      const offerOpening = tenderData.offer_opening ? new Date(tenderData.offer_opening) : null;

      // Create rawData JSON dump
      const rawData = { ...tenderData };

      return prisma.tender.upsert({
        where: { externalId },
        update: {
          title,
          description,
          cpvCodes: tenderData.cpv_codes || tenderData.cpvCodes || [],
          deadline,
          publicationDate: tenderData.publication_date ? new Date(tenderData.publication_date) : (tenderData.publicationDate ? new Date(tenderData.publicationDate) : null),
          offerOpening,
          location,
          budget: budget ? parseFloat(budget) : null,
          type: tenderData.project_type || tenderData.type || null,
          category: tenderData.project_sub_type || tenderData.category || null,
          status: tenderData.status || "open",
          publicationId: tenderData.publication_id || tenderData.publicationId || null,
          detailsFetchedAt: tenderData.details_fetched_at ? new Date(tenderData.details_fetched_at) : null,
          rawData
        },
        create: {
          externalId,
          title,
          description,
          cpvCodes: tenderData.cpv_codes || tenderData.cpvCodes || [],
          deadline,
          publicationDate: tenderData.publication_date ? new Date(tenderData.publication_date) : (tenderData.publicationDate ? new Date(tenderData.publicationDate) : null),
          offerOpening,
          location,
          budget: budget ? parseFloat(budget) : null,
          type: tenderData.project_type || tenderData.type || null,
          category: tenderData.project_sub_type || tenderData.category || null,
          status: tenderData.status || "open",
          publicationId: tenderData.publication_id || tenderData.publicationId || null,
          detailsFetchedAt: tenderData.details_fetched_at ? new Date(tenderData.details_fetched_at) : null,
          rawData
        }
      });
    });

    const upsertedResults = await Promise.all(upsertPromises.filter(Boolean));
    const newTenderIds = upsertedResults.map(t => t.id);

    // Fire off global matching in background
    matchAllCompaniesToNewTenders(newTenderIds).catch(err => console.error("Post-ingest matching error:", err));

    res.status(200).json({ message: `Successfully ingested ${upsertedResults.length} tenders` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error ingesting tender batch' });
  }
};

export const getMissingDetails = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 100;

    const tenders = await prisma.tender.findMany({
      where: { detailsFetchedAt: null },
      select: { id: true, externalId: true, publicationId: true },
      skip: offset,
      take: limit
    });
    
    res.json(tenders);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching missing details records' });
  }
};

export const batchUpdateDetails = async (req, res) => {
  try {
    const { updates } = req.body;
    
    const promises = updates.map(update => {
      const { id, ...data } = update;
      
      const procurement = data.procurement || {};
      const dates = data.dates || {};
      const decision = data.decision || {};
      const base = data.base || {};

      // Enhanced Budget Extraction
      let budget = (procurement.budget || 
                  procurement.totalPriceSelectionValue || 
                  data.decision?.vendors?.[0]?.price?.price);
      
      // Enhanced Deadline Extraction
      const deadlineStr = (
        dates.offerDeadline || 
        dates.offersDeadline ||
        procurement.executionDeadline || 
        decision.awardDecisionDate || 
        base.publicationDate
      );
      const deadline = deadlineStr ? new Date(deadlineStr) : null;

      const pubDateStr = base.publicationDate || null;
      const publicationDate = pubDateStr ? new Date(pubDateStr) : null;

      return prisma.tender.update({
        where: { id },
        data: {
          budget: budget ? parseFloat(budget) : null,
          deadline,
          publicationDate,
          rawData: data,
          detailsFetchedAt: new Date(data.details_fetched_at || new Date())
        }
      });
    });

    await Promise.all(promises.filter(Boolean));
    res.json({ message: `Updated ${promises.length} records!` });
  } catch(e) {
    res.status(500).json({ message: 'Error bulk updating details' });
  }
};
export const getSavedBids = async (req, res) => {
  try {
    const userId = req.user.id;
    const bids = await prisma.bid.findMany({
      where: { userId },
      include: { tender: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching saved bids' });
  }
};

export const saveTenderAsBid = async (req, res) => {
  try {
    const userId = req.user.id;
    const tenderId = req.params.id;

    const bid = await prisma.bid.upsert({
      where: {
        userId_tenderId: { userId, tenderId }
      },
      update: { status: 'saved' },
      create: { userId, tenderId, status: 'saved' }
    });

    // Also bookmark it for convenience
    await prisma.bookmark.upsert({
      where: {
        userId_tenderId: { userId, tenderId }
      },
      update: {},
      create: { userId, tenderId }
    });

    res.json({ message: 'Tender saved successfully', bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving tender' });
  }
};

export const deleteSavedBid = async (req, res) => {
  try {
    const userId = req.user.id;
    const tenderId = req.params.id;

    await prisma.bid.deleteMany({
      where: { userId, tenderId }
    });

    res.json({ message: 'Tender removed from saved bids' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting bid' });
  }
};
export const reparseTenders = async (req, res) => {
  try {
    const tenders = await prisma.tender.findMany({
      where: { NOT: { rawData: null } }
    });

    let count = 0;
    for (const tender of tenders) {
      if (!tender.rawData || typeof tender.rawData !== 'object') continue;
      
      const raw = tender.rawData;
      const procurement = raw.procurement || {};
      const dates = raw.dates || {};
      const decision = raw.decision || {};
      const base = raw.base || {};

      // Improved Sanitization
      const description = stripTags(tender.description || base.orderDescription || "");
      
      // Improved Budget Extraction
      let budget = (procurement.budget || 
                  procurement.totalPriceSelectionValue || 
                  procurement.totalPriceRange?.range?.min ||
                  findBudgetInText(description) ||
                  tender.budget);
      
      if (!budget && decision.vendors?.length > 0) {
          budget = decision.vendors[0].price?.price;
      }

      // Improved Location Extraction
      const location = (
        procurement.orderAddress?.cantonId ||
        findLocationInText(description) ||
        tender.location
      );

      // Improved Deadline Extraction
      const deadlineStr = (
        dates.offerDeadline || 
        dates.offersDeadline ||
        procurement.executionDeadline || 
        decision.awardDecisionDate || 
        base.publicationDate
      );
      const deadline = deadlineStr ? new Date(deadlineStr) : tender.deadline;

      const pubDateStr = base.publicationDate || tender.publicationDate;
      const publicationDate = pubDateStr ? new Date(pubDateStr) : null;

      await prisma.tender.update({
        where: { id: tender.id },
        data: {
          description,
          budget: budget ? parseFloat(budget) : null,
          location,
          deadline,
          publicationDate,
          detailsFetchedAt: tender.detailsFetchedAt || new Date()
        }
      });
      count++;
    }

    res.json({ message: `Successfully re-parsed ${count} tenders` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error reparsing tenders' });
  }
};

export const getTenderStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await prisma.company.findUnique({ where: { userId } });

    if (!company) {
      return res.status(400).json({ message: 'Complete company profile first' });
    }

    const matches = await prisma.match.findMany({
      where: { companyId: company.id },
      include: { tender: true }
    });

    if (matches.length === 0) {
      return res.json({
        totalMatches: 0,
        avgScore: 0,
        topSector: "N/A",
        scoreDistribution: { high: 0, med: 0, low: 0 },
        categoryDistribution: []
      });
    }

    const totalMatches = matches.length;
    const totalScore = matches.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = (totalScore / totalMatches).toFixed(1);

    // Distribution
    const distribution = { high: 0, med: 0, low: 0 };
    const categories = {};

    matches.forEach(m => {
      if (m.score >= 80) distribution.high++;
      else if (m.score >= 50) distribution.med++;
      else distribution.low++;

      const cat = m.tender.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categories)
      .map(([label, count]) => ({ 
        label, 
        count, 
        percentage: Math.round((count / totalMatches) * 100) 
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      totalMatches,
      avgScore,
      topSector: categoryDistribution[0]?.label || "N/A",
      scoreDistribution: distribution,
      categoryDistribution
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error calculating market intelligence' });
  }
};
