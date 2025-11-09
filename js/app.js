// 🎮 PLATAFORMA DE JOGOS - CONTROLLER PRINCIPAL

class GamePlatform {
    constructor() {
        // 🎯 CONCEITO: Estado da aplicação
        this.currentGame = null;  // Jogo atual carregado
        this.currentPage = 'home'; // Página atual
        this.scores = [];         // Array para armazenar scores
        
        this.init(); // Inicializa tudo quando a classe é criada
    }

    init() {
        console.log('🚀 Inicializando Plataforma de Jogos...');
        
        // 🎯 CONCEITO: Event Listeners - "Ouvintes" de eventos
        this.setupNavigation();
        this.setupGameCards();
        this.setupBackButton();
        this.loadScores();
        
        // Mostra a página inicial
        this.showPage('home');
    }

    setupNavigation() {
        console.log('🔧 Configurando navegação...');
        
        // 🎯 CONCEITO: DOM Manipulation
        const homeBtn = document.getElementById('home-btn');
        const gamesBtn = document.getElementById('games-btn');
        const scoresBtn = document.getElementById('scores-btn');

        // 🎯 CONCEITO: Event Handling
        homeBtn.addEventListener('click', () => {
            console.log('🏠 Clicou em Home');
            this.showPage('home');
        });

        gamesBtn.addEventListener('click', () => {
            console.log('🎯 Clicou em Jogos');
            this.showPage('games');
        });

        scoresBtn.addEventListener('click', () => {
            console.log('🏆 Clicou em Ranking');
            this.showPage('scores');
        });
    }

    setupGameCards() {
        console.log('🃏 Configurando cards de jogos...');
        
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            card.addEventListener('click', (event) => {
                // 🎯 CONCEITO: Dataset - dados armazenados no HTML
                const gameName = card.dataset.game;
                console.log(`🎮 Clicou no jogo: ${gameName}`);
                this.loadGame(gameName);
            });
        });
    }

    setupBackButton() {
        document.getElementById('back-btn').addEventListener('click', () => {
            console.log('↩️ Voltando para lista de jogos');
            this.showPage('games');
            
            // Para o jogo atual se existir
            if (this.currentGame && this.currentGame.stop) {
                this.currentGame.stop();
            }
        });
    }

    showPage(pageId) {
        console.log(`📄 Mostrando página: ${pageId}`);
        
        // 🎯 CONCEITO: Manipulação de Classes CSS
        // 1. Esconde todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 2. Remove 'active' de todos os botões
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 3. Mostra a página solicitada
        document.getElementById(pageId).classList.add('active');
        
        // 4. Ativa o botão correspondente
        document.getElementById(`${pageId}-btn`).classList.add('active');
        
        this.currentPage = pageId;
    }

    async loadGame(gameName) {
        console.log(`🎯 Carregando jogo: ${gameName}`);
        
        try {
            // 🎯 CONCEITO: Dynamic Imports
            const module = await import(`./games/${gameName}.js`);
            
            // 🎯 CONCEITO: Instanciação de Classes
            this.currentGame = new module.default();
            
            // Prepara a interface do jogo
            this.prepareGameInterface();
            
            // Mostra a área do jogo
            this.showPage('game-container');
            
            // Inicializa o jogo
            await this.currentGame.init();
            
            console.log('✅ Jogo carregado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao carregar o jogo:', error);
            this.showError('Erro ao carregar o jogo. Tente novamente.');
        }
    }

    prepareGameInterface() {
        console.log('🎨 Preparando interface do jogo...');
        
        const gameTitle = document.getElementById('game-title');
        gameTitle.textContent = this.currentGame.name;
        
        const canvas = document.getElementById('game-canvas');
        
        // 🎯 CONCEITO: Canvas Configuration
        canvas.width = this.currentGame.config?.width || 800;
        canvas.height = this.currentGame.config?.height || 600;
        
        // Configura para mobile
        this.adjustCanvasForMobile(canvas);
    }

    adjustCanvasForMobile(canvas) {
        // 🎯 CONCEITO: Mobile Detection e Responsive Design
        if (window.innerWidth < 768) {
            const maxWidth = window.innerWidth - 40;
            const scale = maxWidth / canvas.width;
            
            canvas.style.width = `${maxWidth}px`;
            canvas.style.height = `${canvas.height * scale}px`;
        }
    }

    loadScores() {
        console.log('📊 Carregando scores...');
        
        // 🎯 CONCEITO: Local Storage - Dados persistentes no navegador
        const savedScores = localStorage.getItem('gameScores');
        
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
        } else {
            // Dados de exemplo
            this.scores = [
                { player: 'Jogador1', game: 'snake', score: 1500, date: '2024-01-15' },
                { player: 'Jogador2', game: 'memory', score: 1200, date: '2024-01-14' },
                { player: 'Jogador3', game: 'snake', score: 800, date: '2024-01-13' }
            ];
        }
        
        this.renderScores();
    }

    renderScores() {
        console.log('🎨 Renderizando tabela de scores...');
        
        const tbody = document.getElementById('scores-body');
        
        // 🎯 CONCEITO: Template Strings e Array Methods
        tbody.innerHTML = this.scores
            .sort((a, b) => b.score - a.score) // Ordena por score (decrescente)
            .map((score, index) => `
                <tr>
                    <td>#${index + 1}</td>
                    <td>${score.player}</td>
                    <td>${this.getGameName(score.game)}</td>
                    <td>${score.score}</td>
                </tr>
            `).join(''); // Converte array em string
    }

    getGameName(gameId) {
        const gameNames = {
            snake: 'Snake Classic',
            memory: 'Jogo da Memória',
            tetris: 'Tetris',
            galaga: 'Galaga',
            arkanoid: 'Arkanoid'
        };
        
        return gameNames[gameId] || gameId;
    }

    saveScore(playerName, gameName, score) {
        console.log(`💾 Salvando score: ${playerName} - ${gameName} - ${score}`);
        
        const newScore = {
            player: playerName,
            game: gameName,
            score: score,
            date: new Date().toISOString().split('T')[0] // Data no formato YYYY-MM-DD
        };
        
        this.scores.push(newScore);
        
        // 🎯 CONCEITO: Local Storage - Salvando dados
        localStorage.setItem('gameScores', JSON.stringify(this.scores));
        
        this.renderScores();
    }

    showError(message) {
        // 🎯 CONCEITO: Criando elementos dinamicamente
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove após 3 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// 🎯 CONCEITO: Event Listener Global
// Espera o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM carregado! Iniciando aplicação...');
    
    // 🎯 CONCEITO: Instância da Aplicação
    window.gamePlatform = new GamePlatform();
});

// 🎯 CONCEITO: Event Listener para Resize
window.addEventListener('resize', () => {
    if (window.gamePlatform && window.gamePlatform.currentGame) {
        const canvas = document.getElementById('game-canvas');
        window.gamePlatform.adjustCanvasForMobile(canvas);
    }
});