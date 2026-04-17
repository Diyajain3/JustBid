import prisma from '../config/db.js';

export const addBookmark = async (req, res) => {
  try {
    const { tenderId } = req.body;
    const userId = req.user.id; // It is safely a String ObjectId now

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        tenderId // No longer parsingInt
      }
    });

    res.status(201).json(bookmark);
  } catch (error) {
    if (error.code === 'P2002') {
       return res.status(400).json({ message: 'Already bookmarked' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error adding bookmark' });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const tenderId = req.params.tenderId; // ObjectId String
    const userId = req.user.id;

    await prisma.bookmark.deleteMany({
      where: {
        userId,
        tenderId
      }
    });

    res.status(200).json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing bookmark' });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { tender: true }
    });

    res.json(bookmarks.map(b => b.tender));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching bookmarks' });
  }
};
