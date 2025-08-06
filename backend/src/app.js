import express from 'express';
import cors from 'cors';
import scrapeController from './controllers/scrapeController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/scrape', scrapeController.scrapeProducts);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} not found` 
  });
});

export default app;