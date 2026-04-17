import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import tenderRoutes from './routes/tender.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';

const app = express();

// Middlewares
app.use(cors()); // Enabled CORS here
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('JustBid API is successfully running!');
});
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default app;
