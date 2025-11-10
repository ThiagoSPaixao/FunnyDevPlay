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
        
        // 🎯 CONCEITO: DOM Manipulation COM PROTEÇÃO
        const homeBtn = document.getElementById('home-btn');
        const gamesBtn = document.getElementById('games-btn');
        const scoresBtn = document.getElementById('scores-btn');

        // 🛡️ PROTEÇÃO: Verifica se os botões existem
        if (!homeBtn || !gamesBtn || !scoresBtn) {
            console.error('❌ Botões de navegação não encontrados!');
            this.showError('Erro: Botões de navegação não encontrados.');
            return;
        }

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
        
        // 🛡️ PROTEÇÃO: Verifica se existem cards de jogo
        if (gameCards.length === 0) {
            console.warn('⚠️ Nenhum card de jogo encontrado!');
            return;
        }
        
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
        const backBtn = document.getElementById('back-btn');
        
        // 🛡️ PROTEÇÃO: Verifica se o botão voltar existe
        if (!backBtn) {
            console.warn('⚠️ Botão voltar não encontrado!');
            return;
        }
        
        backBtn.addEventListener('click', () => {
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
        
        // 🛡️ PROTEÇÃO EXTRA: Verifica se a página existe
        const pageElement = document.getElementById(pageId);
        if (!pageElement) {
            console.error(`❌ Página com ID "${pageId}" não encontrada!`);
            this.showError(`Erro: Página "${pageId}" não existe.`);
            return; // Para a execução aqui
        }
        
        // 🎯 CONCEITO: Manipulação de Classes CSS
        // 1. Esconde todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 2. Remove 'active' de todos os botões
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 3. Mostra a página solicitada (AGORA COM PROTEÇÃO)
        pageElement.classList.add('active');
        
        // 4. Ativa o botão correspondente (COM PROTEÇÃO)
        const buttonId = `${pageId}-btn`;
        const buttonElement = document.getElementById(buttonId);
        if (buttonElement) {
            buttonElement.classList.add('active');
        } else {
            console.warn(`⚠️ Botão com ID "${buttonId}" não encontrado`);
        }
        
        this.currentPage = pageId;
    }

    async loadGame(gameName) {
        console.log(`🎯 Carregando jogo: ${gameName}`);
        console.log(`📁 Tentando carregar: ./games/${gameName}.js`);
        
        try {
            // 🎯 CONCEITO: Dynamic Imports
            console.log('🔍 Antes do import...');
            const module = await import(`./games/${gameName}.js`);
            console.log('✅ Import bem-sucedido!');
            
            // 🎯 CONCEITO: Instanciação de Classes
            console.log('🔨 Criando instância do jogo...');
            this.currentGame = new module.default();
            console.log('✅ Jogo instanciado:', this.currentGame);
            
            // Prepara a interface do jogo
            this.prepareGameInterface();
            
            // Mostra a área do jogo
            this.showPage('game-container');
            
            // Inicializa o jogo
            console.log('🎮 Inicializando jogo...');
            await this.currentGame.init();
            
            console.log('✅ Jogo carregado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro detalhado ao carregar o jogo:');
            console.error('🔴 Tipo do erro:', error.name);
            console.error('🔴 Mensagem:', error.message);
            console.error('🔴 Stack:', error.stack);
            this.showError('Erro ao carregar o jogo. Tente novamente.');
        }
    }

    prepareGameInterface() {
        console.log('🎨 Preparando interface do jogo...');
        
        const gameTitle = document.getElementById('game-title');
        // 🛡️ PROTEÇÃO: Verifica se o título existe
        if (gameTitle) {
            gameTitle.textContent = this.currentGame.name;
        } else {
            console.warn('⚠️ Elemento game-title não encontrado!');
        }
        
        const canvas = document.getElementById('game-canvas');
        
        // 🛡️ PROTEÇÃO: Verifica se o canvas existe
        if (!canvas) {
            console.error('❌ Canvas do jogo não encontrado!');
            this.showError('Erro: Canvas do jogo não encontrado.');
            return;
        }
        
        // 🎯 CONCEITO: Canvas Configuration
        canvas.width = this.currentGame.config?.width || 800;
        canvas.height = this.currentGame.config?.height || 600;
        
        // Configura para mobile
        this.adjustCanvasForMobile(canvas);
    }

    adjustCanvasForMobile(canvas) {
        // 🛡️ PROTEÇÃO: Verifica se o canvas existe
        if (!canvas) {
            console.warn('⚠️ Canvas não encontrado para ajuste mobile');
            return;
        }
        
        // 🎯 CONCEITO: Mobile Detection e Responsive Design
        if (window.innerWidth < 768) {
            const maxWidth = window.innerWidth - 40;
            const scale = maxWidth / canvas.width;
            
            canvas.style.width = `${maxWidth}px`;
            canvas.style.height = `${canvas.height * scale}px`;
        } else {
            // Reset para desktop
            canvas.style.width = '';
            canvas.style.height = '';
        }
    }

    loadScores() {
        console.log('📊 Carregando scores...');
        
        // 🎯 CONCEITO: Local Storage - Dados persistentes no navegador
        const savedScores = localStorage.getItem('gameScores');
        
        if (savedScores) {
            try {
                this.scores = JSON.parse(savedScores);
                console.log('✅ Scores carregados do localStorage');
            } catch (error) {
                console.error('❌ Erro ao parsear scores:', error);
                this.scores = this.getDefaultScores();
            }
        } else {
            console.log('📝 Nenhum score salvo, usando dados padrão');
            this.scores = this.getDefaultScores();
        }
        
        this.renderScores();
    }

    getDefaultScores() {
        // Dados de exemplo
        return [
            { player: 'Jogador1', game: 'snake', score: 1500, date: '2024-01-15' },
            { player: 'Jogador2', game: 'memory', score: 1200, date: '2024-01-14' },
            { player: 'Jogador3', game: 'snake', score: 800, date: '2024-01-13' }
        ];
    }

    renderScores() {
        console.log('🎨 Renderizando tabela de scores...');
        
        const tbody = document.getElementById('scores-body');
        
        // 🛡️ PROTEÇÃO: Verifica se a tabela existe
        if (!tbody) {
            console.error('❌ Tabela de scores não encontrada!');
            return;
        }
        
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
        
        console.log('✅ Tabela de scores renderizada!');
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
        try {
            localStorage.setItem('gameScores', JSON.stringify(this.scores));
            console.log('✅ Score salvo com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao salvar score:', error);
        }
        
        this.renderScores();
    }

    showError(message) {
        console.error('🚨 Mostrando erro:', message);
        
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
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// 🎯 CONCEITO: Event Listener Global
// Espera o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM carregado! Iniciando aplicação...');
    
    try {
        // 🎯 CONCEITO: Instância da Aplicação
        window.gamePlatform = new GamePlatform();
        console.log('✅ Plataforma inicializada com sucesso!');
    } catch (error) {
        console.error('❌ Erro crítico ao inicializar a plataforma:', error);
        
        // Mostra erro para o usuário
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff4444;
            color: white;
            padding: 20px;
            text-align: center;
            font-family: Arial, sans-serif;
            z-index: 10000;
        `;
        errorDiv.textContent = 'Erro crítico ao carregar a plataforma. Recarregue a página.';
        document.body.appendChild(errorDiv);
    }
});

// 🎯 CONCEITO: Event Listener para Resize
window.addEventListener('resize', () => {
    if (window.gamePlatform && window.gamePlatform.currentGame) {
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            window.gamePlatform.adjustCanvasForMobile(canvas);
        }
    }
});

// 🛡️ PROTEÇÃO: Global error handler
window.addEventListener('error', (event) => {
    console.error('🚨 Erro global capturado:', event.error);
});