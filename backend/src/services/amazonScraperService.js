import axios from 'axios';
import { JSDOM } from 'jsdom';

class AmazonScraperService {
  constructor() {
    this.baseURL = 'https://www.amazon.com.br/s';
    
    //Array de User-Agents para rotação
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    ];

    this.baseHeaders = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };

    //Sistema de cache e controle de tempo
    this.cache = new Map(); // Cache para evitar requisições desnecessárias, menos chance da amazon bloquear o acesso
    this.lastRequestTime = 0;
    this.minDelayBetweenRequests = 10000; // 10 segundos mínimo entre requisições
    this.cacheTimeout = 300000; // 5 minutos de cache
  }

  //Método para obter User-Agent aleatório
  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  //Método para obter headers com User-Agent rotativo
  getRotatedHeaders() {
    return {
      ...this.baseHeaders,
      'User-Agent': this.getRandomUserAgent()
    };
  }

  validateKeyword(keyword) {
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
      throw new Error('Keyword is required and must be a non-empty string');
    }
    if (keyword.length > 100) {
      throw new Error('Keyword must be less than 100 characters');
    }
  }

  async fetchSearchPage(keyword) {
    //Verificar cache primeiro
    const cacheKey = keyword.toLowerCase().trim();
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`📋 Using cached data for: "${keyword}" (${Math.round((Date.now() - cached.timestamp) / 1000)}s old)`);
      return cached.data;
    }

    //Garantir delay mínimo entre requisições
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    const remainingDelay = this.minDelayBetweenRequests - timeSinceLastRequest;
    
    if (remainingDelay > 0) {
      console.log(`⏳ Rate limiting: waiting ${Math.round(remainingDelay/1000)}s before next request...`);
      await this.delay(remainingDelay);
    }

    this.validateKeyword(keyword);
    const searchURL = `${this.baseURL}?k=${encodeURIComponent(keyword.trim())}&ref=sr_pg_1`;
    
    try {
      // Delay adicional aleatório, tem que ser aleatório se não o servidor da amazon bloqueia acesso por alguns minutos
      const randomDelay = Math.random() * 3000 + 2000; // 2-5 segundos
      console.log(`🕐 Adding human-like delay: ${Math.round(randomDelay/1000)}s`);
      await this.delay(randomDelay);

      //Usar headers com User-Agent rotativo, tem que usar diferentes para o servidor não bloquear acesso
      const headers = this.getRotatedHeaders();
      console.log(`🎭 Using User-Agent: ${headers['User-Agent'].substring(0, 50)}...`);

      const response = await axios.get(searchURL, {
        headers,
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500 // Aceita redirects e 4xx, tem que ter pois se nao tiver e o site da amazon dar redirect o scrapping dá errado
      });

      //Atualizar timestamp da última requisição
      this.lastRequestTime = Date.now();

      if (response.status === 503) {
        throw new Error('Amazon temporarily blocked the request. Try again in a few minutes.');
      }

      //salvar no cache
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      console.log(`💾 Data cached for keyword: "${keyword}"`);
      return response.data;

    } catch (error) {
      //Atualizar timestamp mesmo em caso de erro
      this.lastRequestTime = Date.now();
      
      if (error.response?.status === 503) {
        throw new Error('Amazon is blocking requests. This is normal for scraping. Try again later or use a VPN.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Wait a few minutes before trying again.');
      }
      console.error('Failed to fetch Amazon page:', error.message);
      throw new Error(`Failed to fetch Amazon search results: ${error.message}`);
    }
  }

  // Função para adicionar delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Método para limpar cache (útil para debug)
  clearCache() {
    this.cache.clear();
    console.log('Cache cleared');
  }

  //Método para obter estatísticas do cache
  getCacheStats() {
    const now = Date.now();
    const validEntries = Array.from(this.cache.values())
      .filter(entry => now - entry.timestamp < this.cacheTimeout);
    
    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      timeSinceLastRequest: Math.round((now - this.lastRequestTime) / 1000)
    };
  }

  parseProductsFromHTML(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const productSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item[data-asin]',
      '.sg-col-inner .s-result-item'
    ];

    let products = [];

    for (const selector of productSelectors) {
      const productElements = document.querySelectorAll(selector);
      if (productElements.length > 0) {
        products = Array.from(productElements)
          .map(element => this.extractProductData(element))
          .filter(product => product !== null);
        break;
      }
    }

    return products;
  }

  extractProductData(element) {
    try {
      const product = {
        title: this.extractTitle(element),
        rating: this.extractRating(element),
        reviewCount: this.extractReviewCount(element),
        imageURL: this.extractImageURL(element),
        price: this.extractPrice(element)
      };

      if (product.title && product.imageURL) {
        return product;
      }
      return null;
    } catch (error) {
      console.warn('Failed to extract product data:', error.message);
      return null;
    }
  }
//extrari titulo do elemento
  extractTitle(element) {
    const titleSelectors = [
      'h2 a span',
      '.s-size-mini span',
      '[data-cy="title-recipe-title"] span',
      '.a-text-normal'
    ];

    for (const selector of titleSelectors) {
      const titleElement = element.querySelector(selector);
      if (titleElement?.textContent?.trim()) {
        return titleElement.textContent.trim();
      }
    }
    return '';
  }
//extrair as estrelinhas de ranking
  extractRating(element) {
    const ratingSelectors = [
      '.a-icon-alt',
      '[aria-label*="stars"]',
      '.a-star-medium .a-icon-alt'
    ];

    for (const selector of ratingSelectors) {
      const ratingElement = element.querySelector(selector);
      if (ratingElement) {
        const ratingText = ratingElement.getAttribute('aria-label') || ratingElement.textContent;
        const ratingMatch = ratingText.match(/(\d+[,.]?\d*)/);
        if (ratingMatch) {
          return parseFloat(ratingMatch[1].replace(',', '.'));
        }
      }
    }
    return null;
  }

  extractReviewCount(element) {
    const reviewSelectors = [
      '.a-size-base',
      '[aria-label*="reviews"]',
      '.a-link-normal'
    ];

    for (const selector of reviewSelectors) {
      const reviewElements = element.querySelectorAll(selector);
      for (const reviewElement of reviewElements) {
        const text = reviewElement.textContent || '';
        const reviewMatch = text.match(/\(?([\d,.]+)\)?/);
        if (reviewMatch && text.toLowerCase().includes('avalia')) {
          return parseInt(reviewMatch[1].replace(/[,.]/g, ''));
        }
      }
    }
    return null;
  }
//extrair a imagem do produto
  extractImageURL(element) {
    const imageSelectors = [
      '.s-image',
      'img[data-image-latency]',
      '.a-dynamic-image'
    ];

    for (const selector of imageSelectors) {
      const imgElement = element.querySelector(selector);
      if (imgElement) {
        const src = imgElement.getAttribute('src') || imgElement.getAttribute('data-src');
        if (src && src.startsWith('http')) {
          return src;
        }
      }
    }
    return '';
  }
  //extrair o preço do produto

  extractPrice(element) {
    // Tentar primeiro o preço completo em um único elemento
    const fullPriceSelectors = [
      '.a-price .a-offscreen',
      '.a-price-whole',
      '.a-text-price .a-offscreen',
      '.a-color-price .a-offscreen'
    ];

    for (const selector of fullPriceSelectors) {
      const priceElement = element.querySelector(selector);
      if (priceElement?.textContent?.trim()) {
        const priceText = priceElement.textContent.trim();
        // Se já tem o preço completo com centavos, retorna
        if (priceText.includes(',') || priceText.includes('.')) {
          return priceText;
        }
      }
    }

    // Se não encontrou preço completo, tenta montar: parte inteira + centavos
    const wholeElement = element.querySelector('.a-price-whole');
    const fractionElement = element.querySelector('.a-price-fraction');
    const symbolElement = element.querySelector('.a-price-symbol');

    if (wholeElement?.textContent?.trim()) {
      let price = '';
      
      // Adicionar símbolo se existir
      if (symbolElement?.textContent?.trim()) {
        price += symbolElement.textContent.trim() + ' ';
      }
      
      // Adicionar parte inteira
      price += wholeElement.textContent.trim();
      
      // Adicionar centavos se existir
      if (fractionElement?.textContent?.trim()) {
        price += ',' + fractionElement.textContent.trim();
      } else {
        // Se não tem centavos explícitos, adicionar ",00"
        price += ',00';
      }
      
      return price;
    }

    // Fallback: tentar outros seletores menos específicos
    const fallbackSelectors = [
      '.a-price',
      '.a-text-price',
      '.a-color-price',
      '[data-a-color="price"]'
    ];

    for (const selector of fallbackSelectors) {
      const priceElement = element.querySelector(selector);
      if (priceElement?.textContent?.trim()) {
        const priceText = priceElement.textContent.trim();
        // Extrair apenas números, vírgula e símbolos de moeda
        const cleanPrice = priceText.match(/[R$\s]*[\d,.]+/);
        if (cleanPrice) {
          return cleanPrice[0].trim();
        }
      }
    }

    return '';
  }

  async scrapeProducts(keyword) {
    try {
      console.log(`🔍 Fetching Amazon page for: "${keyword}"`);
      
      // Mostrar estatísticas do cache
      const cacheStats = this.getCacheStats();
      console.log(`Cache stats: ${cacheStats.validEntries}/${cacheStats.totalEntries} valid entries, ${cacheStats.timeSinceLastRequest}s since last request`);
      
      const html = await this.fetchSearchPage(keyword);
      console.log(`HTML received, parsing products...`);
      const products = this.parseProductsFromHTML(html);
      console.log(`Found ${products.length} products`);

      return {
        success: true,
        keyword,
        totalProducts: products.length,
        products,
        scrapedAt: new Date().toISOString(),
        cached: this.cache.has(keyword.toLowerCase().trim()) // Indica se veio do cache
      };
    } catch (error) {
      console.error(`Scraping failed: ${error.message}`);
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }
}

export default new AmazonScraperService();
