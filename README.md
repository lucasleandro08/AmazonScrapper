<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amazon Product Scraper - README</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fafafa;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #ff9900, #e88300);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.2rem;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }

        .content {
            padding: 30px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            color: #ff9900;
            font-size: 1.5rem;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #ff9900;
        }

        .section h3 {
            color: #333;
            font-size: 1.2rem;
            margin: 20px 0 10px 0;
        }

        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }

        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 15px 0;
        }

        .tech-item {
            background: #4299e1;
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .feature {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #4299e1;
        }

        .info {
            background: #e6f3ff;
            border-left: 4px solid #0066cc;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 6px 6px 0;
        }

        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 6px 6px 0;
        }

        .architecture {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 15px 0;
        }

        ul, ol {
            margin-left: 20px;
            margin-bottom: 10px;
        }

        li {
            margin-bottom: 5px;
        }

        .footer {
            background: #2d3748;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            body { padding: 10px; }
            .header { padding: 20px; }
            .header h1 { font-size: 1.8rem; }
            .content { padding: 20px; }
            .features { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🛒 Amazon Product Scraper</h1>
            <p>Sistema Full-Stack de Web Scraping com Clean Code</p>
        </header>

        <div class="content">
            <div class="section">
                <h2>📋 Visão Geral</h2>
                <p>
                    Sistema completo de web scraping para extrair informações de produtos da Amazon Brasil. 
                    Desenvolvido com <strong>Bun</strong>, <strong>Express</strong>, <strong>Vite</strong> e <strong>Vanilla JavaScript</strong>, 
                    seguindo princípios de <strong>Clean Code</strong> e arquitetura modular.
                </p>

                <div class="features">
                    <div class="feature">
                        <strong>🎨 Interface Moderna</strong><br>
                        Design responsivo com tema Amazon
                    </div>
                    <div class="feature">
                        <strong>⚡ Performance Otimizada</strong><br>
                        Cache inteligente e rate limiting
                    </div>
                    <div class="feature">
                        <strong>🛡️ Tratamento de Erros</strong><br>
                        Gerenciamento robusto com fallbacks
                    </div>
                    <div class="feature">
                        <strong>🧹 Clean Architecture</strong><br>
                        Separação clara de responsabilidades
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>🛠️ Stack Tecnológica</h2>
                
                <h3>Backend</h3>
                <div class="tech-stack">
                    <span class="tech-item">Bun Runtime</span>
                    <span class="tech-item">Express.js</span>
                    <span class="tech-item">Axios</span>
                    <span class="tech-item">JSDOM</span>
                </div>

                <h3>Frontend</h3>
                <div class="tech-stack">
                    <span class="tech-item">Vite</span>
                    <span class="tech-item">Vanilla JavaScript</span>
                    <span class="tech-item">CSS3</span>
                    <span class="tech-item">HTML5</span>
                </div>
            </div>

            <div class="section">
                <h2>🚀 Instalação e Execução</h2>
                
                <div class="info">
                    <strong>Pré-requisitos:</strong> Bun >= 1.0.0, Node.js >= 18.0.0, npm
                </div>

                <h3>1. Configuração do Backend</h3>
                <div class="code-block">
mkdir amazon-scraper && cd amazon-scraper
mkdir backend && cd backend
bun init -y
bun add express axios jsdom cors
# Criar arquivos: server.js, src/app.js, src/controllers/*, src/services/*, src/utils/*
                </div>

                <h3>2. Configuração do Frontend</h3>
                <div class="code-block">
cd ../
mkdir frontend && cd frontend
npm init -y && npm install vite
mkdir src src/js src/css
# Criar arquivos: src/index.html, src/css/styles.css, src/js/main.js, vite.config.js
                </div>

                <h3>3. Execução</h3>
                <div class="code-block">
# Terminal 1 - Backend
cd backend && bun server.js

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Acesse: http://localhost:5173
                </div>
            </div>

            <div class="section">
                <h2>🏗️ Arquitetura</h2>
                
                <div class="architecture">
                    <strong>Clean Code Principles Aplicados:</strong>
                    <ul>
                        <li><strong>Single Responsibility:</strong> Cada classe/módulo tem uma função específica</li>
                        <li><strong>Separation of Concerns:</strong> Controllers → Services → Utils</li>
                        <li><strong>Error Handling:</strong> Middleware centralizado com tratamento específico</li>
                        <li><strong>Modularity:</strong> Código reutilizável e facilmente testável</li>
                    </ul>
                </div>

                <strong>Estrutura do Projeto:</strong>
                <div class="code-block">
amazon-scraper/
├── backend/src/
│   ├── controllers/     # HTTP request handling
│   ├── services/        # Business logic & scraping
│   └── utils/           # Error handling & helpers
└── frontend/src/
    ├── js/              # Client-side logic
    ├── css/             # Responsive styling  
    └── index.html       # Main interface
                </div>
            </div>

            <div class="section">
                <h2>🔗 API Endpoints</h2>
                
                <h3>GET /api/scrape</h3>
                <p><strong>Parâmetro:</strong> <code>keyword</code> (string, obrigatório)</p>
                <div class="code-block">
curl "http://localhost:3000/api/scrape?keyword=notebook"

Response:
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
                </div>
            </div>

            <div class="section">
                <h2>⚙️ Funcionalidades Técnicas</h2>

                <ul>
                    <li><strong>Cache Inteligente:</strong> 5 minutos de cache para evitar requisições desnecessárias</li>
                    <li><strong>Rate Limiting:</strong> 10 segundos mínimos entre buscas diferentes</li>
                    <li><strong>User-Agent Rotation:</strong> 6 User-Agents diferentes para evitar detecção</li>
                    <li><strong>Multiple Selectors:</strong> Fallbacks para diferentes layouts da Amazon</li>
                    <li><strong>Error Recovery:</strong> Tratamento específico para 503, 429 e ECONNREFUSED</li>
                    <li><strong>Responsive Design:</strong> Interface adaptável para desktop e mobile</li>
                </ul>
            </div>

            <div class="section">
                <h2>⚠️ Desafios e Soluções</h2>
                
                <div class="warning">
                    <strong>Principal Desafio:</strong> Sistema anti-bot da Amazon (erro 503)<br>
                    <strong>Solução:</strong> Headers realísticos + delays inteligentes + rotação de User-Agents + cache
                </div>

                <strong>Outros Problemas Resolvidos:</strong>
                <ul>
                    <li>Extração de preços incompleta → Múltiplos seletores + montagem manual</li>
                    <li>Incompatibilidade Bun + Express → Sintaxe de rotas adaptada</li>
                    <li>Bloqueios temporários → Sistema de cache e rate limiting</li>
                </ul>
            </div>

            <div class="section">
                <h2>💡 Como Usar</h2>
                <ol>
                    <li>Acesse <code>http://localhost:5173</code></li>
                    <li>Digite uma palavra-chave (ex: "notebook", "mouse")</li>
                    <li>Clique em "Buscar" e aguarde o processamento</li>
                    <li>Visualize os produtos com título, rating, avaliações, imagem e preço</li>
                </ol>

                <div class="info">
                    <strong>Nota:</strong> A Amazon pode bloquear temporariamente após várias buscas. 
                    Isso é comportamento normal e esperado para sistemas de scraping.
                </div>
            </div>
        </div>

        <footer class="footer">
            <strong>Amazon Product Scraper</strong> | Desenvolvido com Clean Code principles<br>
            <em>Full-Stack JavaScript Project - 2025</em>
        </footer>
    </div>
</body>
</html>
