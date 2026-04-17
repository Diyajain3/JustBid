import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server running safely on local SQLite in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    // Explicitly prevent node from exiting
    setInterval(() => {}, 1000 * 60 * 60);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
