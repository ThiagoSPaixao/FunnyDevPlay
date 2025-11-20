// 🧠 MEMORY GAME - VERSÃO PREMIUM CORRIGIDA

export default class MemoryGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Memory Master";
        this.version = "2.1";
        
        // 🎯 CONFIGURAÇÕES AVANÇADAS
        this.config = {
            width: 800,
            height: 700,
            difficulties: {
                easy: { grid: 4, pairs: 8, time: 120 },
                medium: { grid: 6, pairs: 18, time: 180 },
                hard: { grid: 6, pairs: 18, time: 240 } // 🔧 CORREÇÃO: 8x8 muito grande, mantemos 6x6
            }
        };
        
        // 🎮 Estado do jogo
        this.gameState = 'stopped';
        this.currentDifficulty = 'medium';
        this.score = 0;
        this.highScore = localStorage.getItem('memoryHighScore') || 0;
        
        // 📊 Dados do jogo
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timeLeft = 0;
        this.timer = null;
        this.startTime = 0;
        
        // ✨ Efeitos visuais
        this.particles = [];
        
        // 🎨 Assets visuais
        this.emojiSets = {
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
            fruits: ['🍎', '🍌', '🍒', '🍇', '🍓', '🍉', '🍑', '🍍', '🥭', '🍏', '🍊', '🍋', '🍐', '🥝', '🍈'],
            sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🎿'],
            travel: ['🚗', '✈️', '🚂', '🚀', '🚁', '⛵', '🚤', '🛶', '🚲', '🛴', '🏍️', '🚒', '🚑', '🚓', '🚌']
        };
        
        // 🔧 Referências técnicas
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        
        console.log('🧠 Memory Master criado!');
    }

    async init() {
        console.log('🎮 Inicializando Memory Master...');
        
        try {
            // Configuração do canvas (apenas para partículas)
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
            
            // Cria a interface do jogo
            this.createGameInterface();
            
            // Configura controles
            this.setupControls();
            
            // Inicializa o jogo
            this.reset();
            
            console.log('✅ Memory Master inicializado!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Memory:', error);
            throw error;
        }
    }

    // 🎨 CRIAR INTERFACE DO JOGO
    createGameInterface() {
        const gameContainer = document.getElementById('game-container');
        
        // 🔧 CORREÇÃO: Limpa container antes de adicionar
        gameContainer.innerHTML = '';
        
        const gameHTML = `
            <div class="memory-game">
                <div class="memory-header">
                    <div class="memory-stats">
                        <div class="stat-item">
                            <span class="stat-label">Tempo</span>
                            <span id="time-left" class="stat-value">02:00</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Movimentos</span>
                            <span id="move-count" class="stat-value">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Pares</span>
                            <span id="pairs-matched" class="stat-value">0/18</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Score</span>
                            <span id="memory-score" class="stat-value">0</span>
                        </div>
                    </div>
                </div>

                <div class="difficulty-controls">
                    <h3>🎯 Dificuldade</h3>
                    <div class="difficulty-buttons">
                        <button class="diff-btn" data-diff="easy">Fácil (4x4)</button>
                        <button class="diff-btn active" data-diff="medium">Médio (6x6)</button>
                        <button class="diff-btn" data-diff="hard">Difícil (6x6+)</button>
                    </div>
                </div>

                <div id="memory-grid" class="memory-grid grid-6x6">
                    <!-- Cartas serão geradas dinamicamente aqui -->
                </div>

                <div class="memory-controls">
                    <div class="control-buttons">
                        <button id="memory-start" class="memory-btn">▶️ Iniciar</button>
                        <button id="memory-pause" class="memory-btn">⏸️ Pausar</button>
                        <button id="memory-reset" class="memory-btn">🔄 Reiniciar</button>
                        <button id="memory-hint" class="memory-btn secondary">💡 Dica</button>
                    </div>
                </div>
            </div>
        `;
        
        gameContainer.insertAdjacentHTML('beforeend', gameHTML);
        this.setupGameControls();
        this.setupDifficultyButtons();
    }

    // 🎮 CONFIGURAR CONTROLES DO JOGO
    setupGameControls() {
        document.getElementById('memory-start').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('memory-pause').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('memory-reset').addEventListener('click', () => {
            this.reset();
        });
        
        document.getElementById('memory-hint').addEventListener('click', () => {
            this.showHint();
        });
    }

    // 🎯 CONFIGURAR BOTÕES DE DIFICULDADE
    setupDifficultyButtons() {
        const diffButtons = document.querySelectorAll('.diff-btn');
        
        diffButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.dataset.diff;
                
                // Atualiza botões ativos
                diffButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Muda dificuldade
                this.changeDifficulty(difficulty);
            });
        });
    }

    // 🎮 CONFIGURAR CONTROLES
    setupControls() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.reset();
                    break;
                case 'h':
                case 'H':
                    e.preventDefault();
                    this.showHint();
                    break;
            }
        });
    }

    // 🔄 MUDAR DIFICULDADE
    changeDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        this.reset();
    }

    // 🔄 REINICIAR JOGO
    reset() {
        this.stopGame();
        
        const config = this.config.difficulties[this.currentDifficulty];
        
        // Reinicia estado do jogo
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timeLeft = config.time;
        this.score = 0;
        this.gameState = 'stopped';
        this.particles = [];
        
        // Gera novo conjunto de cartas
        this.generateCards();
        
        // Atualiza interface
        this.updateGameDisplay();
        this.renderCards();
        
        console.log('🔄 Jogo reiniciado com dificuldade:', this.currentDifficulty);
    }

    // 🃏 GERAR CARTAS - VERSÃO CORRIGIDA
    generateCards() {
        const config = this.config.difficulties[this.currentDifficulty];
        const totalPairs = config.pairs;
        
        // Seleciona emojis aleatórios
        const emojiSet = this.emojiSets.animals;
        const selectedEmojis = this.shuffleArray([...emojiSet]).slice(0, totalPairs);
        
        // Cria pares de cartas
        this.cards = [];
        selectedEmojis.forEach(emoji => {
            this.cards.push({ 
                emoji, 
                flipped: false, 
                matched: false, 
                id: Math.random().toString(36).substr(2, 9)
            });
            this.cards.push({ 
                emoji, 
                flipped: false, 
                matched: false, 
                id: Math.random().toString(36).substr(2, 9)
            });
        });
        
        // Embaralha as cartas
        this.cards = this.shuffleArray(this.cards);
    }

    // 🎰 EMBARALHAR ARRAY
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // 🎮 INICIAR JOGO
    startGame() {
        if (this.gameState === 'running') return;
        
        this.gameState = 'running';
        this.startTime = Date.now();
        
        // Inicia timer
        this.startTimer();
        
        console.log('🎮 Jogo iniciado!');
    }

    // ⏰ INICIAR TIMER
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (this.gameState !== 'running') return;
            
            this.timeLeft--;
            this.updateGameDisplay();
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    // ⏸️ PAUSAR/DESPAUSAR
    togglePause() {
        if (this.gameState === 'running') {
            this.gameState = 'paused';
            if (this.timer) clearInterval(this.timer);
        } else if (this.gameState === 'paused') {
            this.gameState = 'running';
            this.startTimer();
        }
    }

    // ⏹️ PARAR JOGO
    stopGame() {
        this.gameState = 'stopped';
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // 🎯 VIRAR CARTA - VERSÃO CORRIGIDA
    flipCard(cardIndex) {
        if (this.gameState !== 'running') return;
        if (this.flippedCards.length >= 2) return;
        
        const card = this.cards[cardIndex];
        
        // Verifica se a carta pode ser virada
        if (card.flipped || card.matched) return;
        
        // Vira a carta
        card.flipped = true;
        this.flippedCards.push(cardIndex);
        
        // Atualiza display
        this.renderCards();
        
        // Verifica se formou par
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.checkForMatch();
        }
        
        this.updateGameDisplay();
    }

    // ✅ VERIFICAR SE FORMOU PAR - VERSÃO CORRIGIDA
    checkForMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        
        // 🔧 CORREÇÃO: Usar setTimeout único para controle melhor
        setTimeout(() => {
            if (card1.emoji === card2.emoji) {
                // PAR ENCONTRADO!
                card1.matched = true;
                card2.matched = true;
                this.matchedPairs++;
                
                // Cria efeitos visuais
                this.createMatchEffects(index1, index2);
                
                // Calcula pontos
                this.calculateScore(true);
                
                // Verifica vitória
                const totalPairs = this.config.difficulties[this.currentDifficulty].pairs;
                if (this.matchedPairs === totalPairs) {
                    setTimeout(() => this.gameComplete(), 500);
                }
                
                // Limpa cartas viradas
                this.flippedCards = [];
                this.renderCards();
                
            } else {
                // PAR ERRADO
                this.calculateScore(false);
                
                // Desvira as cartas
                card1.flipped = false;
                card2.flipped = false;
                this.flippedCards = [];
                
                // Pequeno delay antes de atualizar visual
                setTimeout(() => {
                    this.renderCards();
                }, 300);
            }
            
            this.updateGameDisplay();
        }, 600);
    }

    // ✨ CRIAR EFEITOS DE ACERTO - VERSÃO SIMPLIFICADA
    createMatchEffects(index1, index2) {
        // Cria partículas simples
        this.createParticles(index1, index2);
    }

    // ✨ CRIAR PARTÍCULAS - VERSÃO CORRIGIDA
    createParticles(index1, index2) {
        const cardElements = document.querySelectorAll('.memory-card');
        const card1 = cardElements[index1];
        const card2 = cardElements[index2];
        
        if (!card1 || !card2) return;
        
        const rect1 = card1.getBoundingClientRect();
        const rect2 = card2.getBoundingClientRect();
        
        // Posições centrais das cartas
        const centerX1 = rect1.left + rect1.width / 2;
        const centerY1 = rect1.top + rect1.height / 2;
        const centerX2 = rect2.left + rect2.width / 2;
        const centerY2 = rect2.top + rect2.height / 2;
        
        // Cria elementos de partícula no DOM
        for (let i = 0; i < 6; i++) {
            this.createParticleElement(centerX1, centerY1, this.cards[index1].emoji);
            this.createParticleElement(centerX2, centerY2, this.cards[index2].emoji);
        }
    }

    // ✨ CRIAR ELEMENTO DE PARTÍCULA
    createParticleElement(x, y, emoji) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emoji;
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            --tx: ${(Math.random() - 0.5) * 200}px;
            --ty: ${(Math.random() - 0.5) * 200}px;
        `;
        
        document.body.appendChild(particle);
        
        // Remove após animação
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }

    // 📊 CALCULAR SCORE - VERSÃO CORRIGIDA
    calculateScore(isMatch) {
        const config = this.config.difficulties[this.currentDifficulty];
        
        if (isMatch) {
            // Pontuação base + bônus por tempo restante + bônus por dificuldade
            const basePoints = 100;
            const timeBonus = Math.floor((this.timeLeft / config.time) * 50);
            const difficultyBonus = config.grid * 10;
            const points = basePoints + timeBonus + difficultyBonus;
            
            this.score += Math.max(points, 50);
        } else {
            // Penalidade por erro
            this.score = Math.max(0, this.score - 5);
        }
    }

    // 🏆 JOGO COMPLETO
    gameComplete() {
        this.gameState = 'completed';
        this.stopGame();
        
        // Bônus de tempo restante
        const timeBonus = this.timeLeft * 5;
        this.score += timeBonus;
        
        // Atualiza high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('memoryHighScore', this.highScore);
        }
        
        // Salva score na plataforma
        if (window.gamePlatform) {
            window.gamePlatform.saveScore('Jogador', 'memory', this.score);
        }
        
        // Mostra tela de resultados
        this.showResultScreen(true);
        
        console.log('🏆 Jogo completo! Score:', this.score);
    }

    // 💀 GAME OVER
    gameOver() {
        this.gameState = 'gameover';
        this.stopGame();
        
        // Mostra tela de game over
        this.showResultScreen(false);
    }

    // 📱 RENDERIZAR CARTAS NO HTML - VERSÃO CORRIGIDA
    renderCards() {
        const grid = document.getElementById('memory-grid');
        if (!grid) return;
        
        const config = this.config.difficulties[this.currentDifficulty];
        
        // Atualiza classe do grid
        grid.className = `memory-grid grid-${config.grid}x${config.grid}`;
        
        // Gera HTML das cartas
        grid.innerHTML = this.cards.map((card, index) => {
            let cardClass = 'memory-card';
            if (card.flipped) cardClass += ' flipped';
            if (card.matched) cardClass += ' matched';
            
            return `
                <div class="${cardClass}" data-index="${index}">
                    <div class="card-face card-front">
                        <span class="card-emoji">${card.emoji}</span>
                    </div>
                    <div class="card-face card-back">
                        <span class="card-pattern">?</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Adiciona event listeners
        this.setupCardEvents();
    }

    // 🎯 CONFIGURAR EVENTOS DAS CARTAS
    setupCardEvents() {
        const cards = document.querySelectorAll('.memory-card');
        
        cards.forEach(card => {
            // Remove event listeners existentes
            card.replaceWith(card.cloneNode(true));
        });
        
        // Re-seleciona após clone
        const newCards = document.querySelectorAll('.memory-card');
        
        newCards.forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.index);
                this.flipCard(index);
            });
        });
    }

    // 💡 MOSTRAR DICA - VERSÃO CORRIGIDA
    showHint() {
        if (this.gameState !== 'running' || this.flippedCards.length > 0) return;
        
        // Encontra pares não descobertos
        const unmatchedCards = [];
        const emojiMap = new Map();
        
        this.cards.forEach((card, index) => {
            if (!card.matched && !card.flipped) {
                if (emojiMap.has(card.emoji)) {
                    unmatchedCards.push([emojiMap.get(card.emoji), index]);
                } else {
                    emojiMap.set(card.emoji, index);
                }
            }
        });
        
        if (unmatchedCards.length > 0) {
            // Pega o primeiro par encontrado
            const [index1, index2] = unmatchedCards[0];
            
            // Pisca as cartas da dica
            this.flashHintCards([index1, index2]);
            
            // Penalidade por usar dica
            this.score = Math.max(0, this.score - 20);
            this.updateGameDisplay();
        }
    }

    // ✨ PISCAR CARTAS DA DICA
    flashHintCards(indices) {
        indices.forEach(index => {
            const cardElement = document.querySelector(`.memory-card[data-index="${index}"]`);
            
            if (cardElement) {
                // Adiciona classe de hint
                cardElement.classList.add('hint-card');
                
                // Remove após animação
                setTimeout(() => {
                    cardElement.classList.remove('hint-card');
                }, 1000);
            }
        });
    }

    // 📊 ATUALIZAR DISPLAY DO JOGO
    updateGameDisplay() {
        const config = this.config.difficulties[this.currentDifficulty];
        
        // Atualiza tempo
        const timeElement = document.getElementById('time-left');
        if (timeElement) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Muda cor se tempo estiver acabando
            if (this.timeLeft < 30) {
                timeElement.style.color = '#FF5252';
            } else {
                timeElement.style.color = '#4CAF50';
            }
        }
        
        // Atualiza movimentos
        const movesElement = document.getElementById('move-count');
        if (movesElement) movesElement.textContent = this.moves;
        
        // Atualiza pares
        const pairsElement = document.getElementById('pairs-matched');
        if (pairsElement) pairsElement.textContent = `${this.matchedPairs}/${config.pairs}`;
        
        // Atualiza score
        const scoreElement = document.getElementById('memory-score');
        if (scoreElement) scoreElement.textContent = this.score;
    }

    // 🏆 MOSTRAR TELA DE RESULTADOS
    showResultScreen(isWin) {
        const resultHTML = `
            <div class="result-screen">
                <div class="result-content">
                    <h1 class="result-title">${isWin ? '🏆 Vitória!' : '💀 Game Over'}</h1>
                    
                    <div class="result-stats">
                        <div class="result-stat">
                            <span class="stat-label">Score Final</span>
                            <span class="stat-number">${this.score}</span>
                        </div>
                        <div class="result-stat">
                            <span class="stat-label">Movimentos</span>
                            <span class="stat-number">${this.moves}</span>
                        </div>
                        <div class="result-stat">
                            <span class="stat-label">Tempo Restante</span>
                            <span class="stat-number">${this.timeLeft}s</span>
                        </div>
                        <div class="result-stat">
                            <span class="stat-label">Recorde</span>
                            <span class="stat-number">${this.highScore}</span>
                        </div>
                    </div>
                    
                    <div class="control-buttons">
                        <button id="result-play-again" class="memory-btn">🔄 Jogar Novamente</button>
                        <button id="result-main-menu" class="memory-btn secondary">🏠 Menu Principal</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', resultHTML);
        
        // Configura eventos dos botões
        document.getElementById('result-play-again').addEventListener('click', () => {
            document.querySelector('.result-screen')?.remove();
            this.reset();
            this.startGame();
        });
        
        document.getElementById('result-main-menu').addEventListener('click', () => {
            document.querySelector('.result-screen')?.remove();
            if (window.gamePlatform) {
                window.gamePlatform.showPage('games');
            }
        });
    }

    // 🧹 DESTRUIR JOGO
    destroy() {
        this.stopGame();
        
        // Remove elementos do jogo
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.innerHTML = '<canvas id="game-canvas"></canvas>';
        }
        
        // Remove tela de resultados se existir
        document.querySelector('.result-screen')?.remove();
    }
}