import prisma from '../config/db.js';

export const getTenders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tenders, total] = await Promise.all([
      prisma.tender.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
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

      // Extract raw description
      let description = tenderData.description || null;
      if (typeof description === 'object' && description !== null) {
        description = description[tenderData.language] || description['en'] || description['de'];
      }

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
          offerOpening,
          location: tenderData.region || tenderData.location || null,
          budget: tenderData.budget || null,
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
          offerOpening,
          location: tenderData.region || tenderData.location || null,
          budget: tenderData.budget || null,
          status: tenderData.status || "open",
          publicationId: tenderData.publication_id || tenderData.publicationId || null,
          detailsFetchedAt: tenderData.details_fetched_at ? new Date(tenderData.details_fetched_at) : null,
          rawData
        }
      });
    });

    await Promise.all(upsertPromises.filter(Boolean));

    res.status(200).json({ message: `Successfully ingested ${upsertPromises.length} tenders` });
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
      return prisma.tender.update({
        where: { id },
        data: {
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
