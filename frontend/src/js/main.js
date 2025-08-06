/**
 * Amazon Product Scraper Frontend
 */

// Configuration
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    SCRAPE: '/api/scrape'
  },
  TIMEOUT: 30000,
  MAX_KEYWORD_LENGTH: 100
};

// DOM Elements
const elements = {
  keywordInput: document.getElementById('keyword-input'),
  searchButton: document.getElementById('search-button'),
  buttonText: document.querySelector('.button-text'),
  buttonLoader: document.querySelector('.button-loader'),
  resultsSection: document.getElementById('results-section'),
  resultsTitle: document.getElementById('results-title'),
  resultsStats: document.getElementById('results-stats'),
  productsGrid: document.getElementById('products-grid'),
  errorSection: document.getElementById('error-section'),
  errorText: document.getElementById('error-text'),
  retryButton: document.getElementById('retry-button'),
  emptyState: document.getElementById('empty-state')
};

/**
 * API Service Class
 * Handles all API communications with proper error handling
 */
class ApiService {
  constructor(baseURL, timeout = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Makes HTTP requests with timeout and error handling
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Requisição cancelada por timeout. Tente novamente.');
      }
      
      if (error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
      }
      
      throw error;
    }
  }

  /**
   * Scrapes products from Amazon
   * @param {string} keyword - Search keyword
   * @returns {Promise<Object>} Scraping results
   */
  async scrapeProducts(keyword) {
    const url = `${this.baseURL}${CONFIG.ENDPOINTS.SCRAPE}?keyword=${encodeURIComponent(keyword)}`;
    return this.request(url);
  }
}

/**
 * UI Controller Class
 * Manages all UI interactions and state changes
 */
class UIController {
  constructor() {
    this.isLoading = false;
    this.currentKeyword = '';
  }

  /**
   * Shows loading state
   */
  showLoading() {
    this.isLoading = true;
    elements.searchButton.disabled = true;
    elements.buttonText.style.display = 'none';
    elements.buttonLoader.style.display = 'flex';
    this.hideAllSections();
  }

  /**
   * Hides loading state
   */
  hideLoading() {
    this.isLoading = false;
    elements.searchButton.disabled = false;
    elements.buttonText.style.display = 'block';
    elements.buttonLoader.style.display = 'none';
  }

  /**
   * Hides all result sections
   */
  hideAllSections() {
    elements.resultsSection.style.display = 'none';
    elements.errorSection.style.display = 'none';
    elements.emptyState.style.display = 'none';
  }

  /**
   * Shows products in grid layout
   * @param {Object} data - API response data
   */
  showProducts(data) {
    const { keyword, products, totalProducts, scrapedAt } = data;
    
    this.hideAllSections();
    
    if (totalProducts === 0) {
      this.showEmptyState();
      return;
    }

    // Update results header
    elements.resultsTitle.textContent = `Resultados para "${keyword}"`;
    elements.resultsStats.textContent = `${totalProducts} produto(s) encontrado(s)`;
    
    // Clear and populate products grid
    elements.productsGrid.innerHTML = '';
    
    products.forEach(product => {
      const productCard = this.createProductCard(product);
      elements.productsGrid.appendChild(productCard);
    });

    elements.resultsSection.style.display = 'block';
    
    // Smooth scroll to results
    setTimeout(() => {
      elements.resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  /**
   * Creates a product card element
   * @param {Object} product - Product data
   * @returns {HTMLElement} Product card element
   */
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageUrl = product.imageURL || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Sem imagem</text></svg>';
    
    card.innerHTML = `
      <img src="${imageUrl}" alt="${this.escapeHtml(product.title)}" class="product-image" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;200&quot; height=&quot;200&quot; viewBox=&quot;0 0 200 200&quot;><rect width=&quot;200&quot; height=&quot;200&quot; fill=&quot;%23f0f0f0&quot;/><text x=&quot;50%&quot; y=&quot;50%&quot; text-anchor=&quot;middle&quot; dy=&quot;.3em&quot; fill=&quot;%23999&quot;>Sem imagem</text></svg>'">
      
      <h3 class="product-title">${this.escapeHtml(product.title)}</h3>
      
      <div class="product-meta">
        ${this.renderRating(product.rating, product.reviewCount)}
        ${product.price ? `<div class="product-price">R$ ${this.escapeHtml(product.price)}</div>` : ''}
      </div>
    `;
    
    return card;
  }

  /**
   * Renders product rating with stars
   * @param {number|null} rating - Product rating
   * @param {number|null} reviewCount - Number of reviews
   * @returns {string} Rating HTML
   */
  renderRating(rating, reviewCount) {
    if (!rating) return '';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '★'.repeat(fullStars);
    if (hasHalfStar) starsHtml += '☆';
    starsHtml += '☆'.repeat(emptyStars);
    
    const reviewText = reviewCount ? `(${this.formatNumber(reviewCount)} avaliações)` : '';
    
    return `
      <div class="product-rating">
        <span class="stars">${starsHtml}</span>
        <span class="rating-value">${rating.toFixed(1)}</span>
        ${reviewCount ? `<span class="review-count">${reviewText}</span>` : ''}
      </div>
    `;
  }

  /**
   * Shows error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.hideAllSections();
    elements.errorText.textContent = message;
    elements.errorSection.style.display = 'block';
    
    setTimeout(() => {
      elements.errorSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  /**
   * Shows empty state
   */
  showEmptyState() {
    this.hideAllSections();
    elements.emptyState.style.display = 'block';
    
    setTimeout(() => {
      elements.emptyState.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  /**
   * Validates search input
   * @param {string} keyword - Search keyword
   * @returns {Object} Validation result
   */
  validateInput(keyword) {
    if (!keyword || keyword.trim().length === 0) {
      return {
        isValid: false,
        message: 'Por favor, digite uma palavra-chave para buscar.'
      };
    }

    if (keyword.length > CONFIG.MAX_KEYWORD_LENGTH) {
      return {
        isValid: false,
        message: `A palavra-chave deve ter no máximo ${CONFIG.MAX_KEYWORD_LENGTH} caracteres.`
      };
    }

    return { isValid: true };
  }

  /**
   * Escapes HTML to prevent XSS
   * @param {string} unsafe - Unsafe string
   * @returns {string} Safe HTML string
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Formats numbers with thousands separator
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
  }

  /**
   * Gets current input value
   * @returns {string} Trimmed input value
   */
  getCurrentKeyword() {
    return elements.keywordInput.value.trim();
  }

  /**
   * Focuses on input field
   */
  focusInput() {
    elements.keywordInput.focus();
  }
}

/**
 * Main Application Class
 * Coordinates between API service and UI controller
 */
class AmazonScraperApp {
  constructor() {
    this.apiService = new ApiService(CONFIG.API_BASE_URL, CONFIG.TIMEOUT);
    this.uiController = new UIController();
    this.init();
  }

  /**
   * Initializes the application
   */
  init() {
    this.setupEventListeners();
    this.uiController.focusInput();
    console.log('Amazon Scraper App initialized');
  }

  /**
   * Sets up all event listeners
   */
  setupEventListeners() {
    // Search button click
    elements.searchButton.addEventListener('click', () => {
      this.handleSearch();
    });

    // Enter key in input field
    elements.keywordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.uiController.isLoading) {
        this.handleSearch();
      }
    });

    // Retry button click
    elements.retryButton.addEventListener('click', () => {
      this.handleSearch();
    });

    // Input validation
    elements.keywordInput.addEventListener('input', (e) => {
      const keyword = e.target.value;
      if (keyword.length > CONFIG.MAX_KEYWORD_LENGTH) {
        e.target.value = keyword.substring(0, CONFIG.MAX_KEYWORD_LENGTH);
      }
    });
  }

  /**
   * Handles search functionality
   */
  async handleSearch() {
    if (this.uiController.isLoading) return;

    const keyword = this.uiController.getCurrentKeyword();
    
    // Validate input
    const validation = this.uiController.validateInput(keyword);
    if (!validation.isValid) {
      this.uiController.showError(validation.message);
      return;
    }

    try {
      console.log(`Searching for: "${keyword}"`);
      
      this.uiController.showLoading();
      this.uiController.currentKeyword = keyword;

      const data = await this.apiService.scrapeProducts(keyword);
      
      console.log(`Search completed:`, data);
      
      this.uiController.showProducts(data);

    } catch (error) {
      console.error('0Search failed:', error);
      
      const userFriendlyMessage = this.getErrorMessage(error);
      this.uiController.showError(userFriendlyMessage);
      
    } finally {
      this.uiController.hideLoading();
    }
  }

  /**
   * Converts technical errors to user-friendly messages
   * @param {Error} error - Original error
   * @returns {string} User-friendly error message
   */
  getErrorMessage(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('conexão') || message.includes('servidor')) {
      return 'Erro de conexão. Verifique se o servidor está rodando na porta 3000.';
    }
    
    if (message.includes('timeout')) {
      return 'A busca demorou muito para responder. Tente novamente com uma palavra-chave mais específica.';
    }
    
    if (message.includes('amazon')) {
      return 'Não foi possível acessar a Amazon no momento. Tente novamente em alguns minutos.';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Problema de rede. Verifique sua conexão com a internet.';
    }
    
    return error.message || 'Erro inesperado. Tente novamente.';
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AmazonScraperApp();
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});
