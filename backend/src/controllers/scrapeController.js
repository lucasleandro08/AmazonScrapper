import amazonScraperService from '../services/amazonScraperService.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * Scrape Controller
 * Handles HTTP requests for scraping operations
 */
class ScrapeController {
  /**
   * Handles GET /api/scrape endpoint
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  scrapeProducts = asyncHandler(async (req, res) => {
    const { keyword } = req.query;

    // Validate query parameter
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter',
        message: 'Please provide a keyword query parameter'
      });
    }

    console.log(`Starting scrape for keyword: "${keyword}"`);

    const results = await amazonScraperService.scrapeProducts(keyword);

    console.log(`Scrape completed. Found ${results.totalProducts} products`);

    res.json(results);
  });
}

export default new ScrapeController();