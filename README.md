# 🛒 Amazon Product Scraper

**Sistema Full-Stack de Web Scraping com Clean Code**

Sistema completo de web scraping para extrair informações de produtos da Amazon Brasil. Desenvolvido com **Bun**, **Express**, **Vite** e **Vanilla JavaScript**, seguindo princípios de **Clean Code** e arquitetura modular.

## ✨ Principais Características

| 🎨 Interface Moderna | ⚡ Performance Otimizada | 🛡️ Tratamento de Erros | 🧹 Clean Architecture |
|---|---|---|---|
| Design responsivo com tema Amazon | Cache inteligente e rate limiting | Gerenciamento robusto com fallbacks | Separação clara de responsabilidades |

## 🛠️ Stack Tecnológica

### Backend
![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![JSDOM](https://img.shields.io/badge/JSDOM-E34F26?style=flat&logoColor=white)

### Frontend
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)

## 🚀 Instalação e Execução

> **Pré-requisitos:** Bun >= 1.0.0, Node.js >= 18.0.0, npm

### 1. Clone o Repositório

git clone <repository-url>
cd AmazonScraper

text

### 2. Configuração do Backend

cd backend
npm i --save

text

### 3. Configuração do Frontend

cd ../frontend
npm i --save

text

### 4. Execução

Terminal 1 - Backend
cd backend
bun server.js

Terminal 2 - Frontend
cd frontend
npm run dev

Acesse: http://localhost:5173
text

## 🏗️ Arquitetura

### Clean Code Principles Aplicados:

- **Single Responsibility:** Cada classe/módulo tem uma função específica
- **Separation of Concerns:** Controllers → Services → Utils
- **Error Handling:** Middleware centralizado com tratamento específico
- **Modularity:** Código reutilizável e facilmente testável

### Estrutura do Projeto:

amazon-scraper/
├── backend/
│ ├── src/
│ │ ├── controllers/ # HTTP request handling
│ │ ├── services/ # Business logic & scraping
│ │ └── utils/ # Error handling & helpers
│ ├── package.json
│ └── server.js
└── frontend/
├── src/
│ ├── js/ # Client-side logic
│ ├── css/ # Responsive styling
│ └── index.html # Main interface
├── package.json
└── vite.config.js

text

## 🔗 API Endpoints

### GET /api/scrape

**Parâmetro:** `keyword` (string, obrigatório)

curl "http://localhost:3000/api/scrape?keyword=notebook"

text

**Response:**
{
"success": true,
"keyword": "notebook",
"totalProducts": 16,
"products": [
{
"title": "Notebook Dell Inspiron 15",
"rating": 4.3,
"reviewCount": 1250,
"imageURL": "https://...",
"price": "R$ 2.499,00"
}
],
"cached": false
}

text

## ⚙️ Funcionalidades Técnicas

- **Cache Inteligente:** 5 minutos de cache para evitar requisições desnecessárias
- **Rate Limiting:** 10 segundos mínimos entre buscas diferentes
- **User-Agent Rotation:** 6 User-Agents diferentes para evitar detecção
- **Multiple Selectors:** Fallbacks para diferentes layouts da Amazon
- **Error Recovery:** Tratamento específico para 503, 429 e ECONNREFUSED

## ⚠️ Desafios e Soluções

> **Principal Desafio:** Sistema anti-bot da Amazon (erro 503)  
> **Solução:** Headers realísticos + delays inteligentes + rotação de User-Agents + cache
- Bloqueios temporários → Sistema de cache e rate limiting

## 💡 Como Usar

1. Acesse `http://localhost:5173`
2. Digite uma palavra-chave (ex: "notebook", "mouse")
3. Clique em "Buscar" e aguarde o processamento
4. Visualize os produtos com título, rating, avaliações, imagem e preço

> **Nota:** A Amazon pode bloquear temporariamente após várias buscas. Isso é comportamento normal e esperado para sistemas de scraping.
