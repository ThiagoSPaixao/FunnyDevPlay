// 🏓 ARKANOID - VERSÃO SIMPLIFICADA E FUNCIONAL

export default class ArkanoidGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Arkanoid";
        this.version = "1.0";
        
        // 🎯 CONFIGURAÇÕES BÁSICAS
        this.config = {
            width: 800,
            height: 600,
            paddleWidth: 100,
            paddleHeight: 20,
            ballSize: 10,
            ballSpeed: 5
        };
        
        // 🎮 Estado do jogo
        this.gameState = 'stopped';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // 🏓 Elementos do jogo
        this.paddle = null;
        this.ball = null;
        this.bricks = [];
        
        // 🔧 Referências
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        
        // 🎯 Controles
        this.keys = {};
        this.mouseX = 0;
        
        console.log('🏓 Arkanoid criado!');
    }

    async init() {
        console.log('🎮 Inicializando Arkanoid...');
        
        try {
            // Configuração do canvas
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Define tamanho fixo do canvas
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
            
            console.log('📐 Canvas configurado:', this.canvas.width, 'x', this.canvas.height);
            
            // Cria interface do jogo
            this.createGameInterface();
            
            // Configura controles
            this.setupControls();
            
            // Inicializa o jogo
            this.reset();
            
            console.log('✅ Arkanoid inicializado!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Arkanoid:', error);
            throw error;
        }
    }

    // 🎨 CRIAR INTERFACE DO JOGO
    createGameInterface() {
        const gameContainer = document.getElementById('game-container');
        
        // Limpa container antes de adicionar
        gameContainer.innerHTML = '';
        
        const gameHTML = `
            <div class="arkanoid-game">
                <div class="arkanoid-header">
                    <h2>🏓 Arkanoid</h2>
                </div>

                <div class="arkanoid-stats">
                    <div class="stat-item">
                        <span class="stat-label">Score</span>
                        <span id="arkanoid-score" class="stat-value">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Level</span>
                        <span id="arkanoid-level" class="stat-value">1</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Lives</span>
                        <span id="arkanoid-lives" class="stat-value">3</span>
                    </div>
                </div>

                <div class="arkanoid-container">
                    <canvas id="game-canvas"></canvas>
                    <div id="pause-overlay" class="pause-overlay" style="display: none;">
                        <div class="pause-content">
                            <div class="pause-title">⏸️ PAUSED</div>
                            <div class="pause-subtitle">Click to continue</div>
                        </div>
                    </div>
                </div>

                <div class="arkanoid-controls">
                    <div class="control-buttons">
                        <button id="arkanoid-start" class="arkanoid-btn">▶️ Iniciar</button>
                        <button id="arkanoid-pause" class="arkanoid-btn">⏸️ Pausar</button>
                        <button id="arkanoid-reset" class="arkanoid-btn">🔄 Reiniciar</button>
                    </div>
                    <div style="margin-top: 10px; color: white; font-size: 14px;">
                        Controles: Mouse ou Setas ← →
                    </div>
                </div>
            </div>
        `;
        
        gameContainer.insertAdjacentHTML('beforeend', gameHTML);
        
        // Re-configura o canvas após criar a interface
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        
        this.setupGameControls();
    }

    // 🎮 CONFIGURAR CONTROLES DO JOGO
    setupGameControls() {
        document.getElementById('arkanoid-start').addEventListener('click', () => {
            console.log('🎯 Botão Iniciar clicado');
            this.startGame();
        });
        
        document.getElementById('arkanoid-pause').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('arkanoid-reset').addEventListener('click', () => {
            this.reset();
        });
    }

    // ⌨️ CONFIGURAR CONTROLES
    setupControls() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Controles de mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'paused') {
                this.togglePause();
            }
        });
    }

    // 🔄 REINICIAR JOGO
    reset() {
        console.log('🔄 Reiniciando Arkanoid...');
        this.stopGame();
        
        // Reinicia estado do jogo
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Inicializa elementos
        this.initPaddle();
        this.initBall();
        this.createBricks();
        
        // Atualiza display
        this.updateGameDisplay();
        this.draw();
        
        console.log('✅ Arkanoid reiniciado!');
    }

    // 🎮 INICIAR JOGO
    startGame() {
        if (this.gameState === 'running') return;
        
        console.log('🚀 Iniciando jogo...');
        this.gameState = 'running';
        this.startGameLoop();
    }

    // 🎯 GAME LOOP
    startGameLoop() {
        const gameLoop = () => {
            if (this.gameState !== 'running') return;
            
            this.update();
            this.draw();
            
            this.gameLoop = requestAnimationFrame(gameLoop);
        };
        
        this.gameLoop = requestAnimationFrame(gameLoop);
        console.log('🔄 Game loop iniciado');
    }

    // 🔄 ATUALIZAR ESTADO DO JOGO
    update() {
        // Processa controles
        this.processInput();
        
        // Atualiza posição da plataforma
        this.updatePaddle();
        
        // Atualiza bola
        this.updateBall();
        
        // Verifica colisões
        this.checkCollisions();
        
        // Verifica se nível foi completado
        this.checkLevelComplete();
    }

    // 🎮 PROCESSAR INPUT
    processInput() {
        // Teclado
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.paddle.x -= 8;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.paddle.x += 8;
        }
        
        // Mouse (prioridade)
        if (this.mouseX > 0) {
            this.paddle.x = this.mouseX - this.paddle.width / 2;
        }
        
        // Mantém paddle dentro dos limites
        this.paddle.x = Math.max(0, Math.min(this.config.width - this.paddle.width, this.paddle.x));
    }

    // 🏓 ATUALIZAR PLATAFORMA
    updatePaddle() {
        // Já atualizado no processInput
    }

    // 🎾 ATUALIZAR BOLA
    updateBall() {
        if (!this.ball) return;
        
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Colisão com paredes
        if (this.ball.x <= 0 || this.ball.x >= this.config.width - this.ball.size) {
            this.ball.dx = -this.ball.dx;
        }
        
        // Colisão com teto
        if (this.ball.y <= 0) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Colisão com chão (perde vida)
        if (this.ball.y >= this.config.height) {
            this.loseLife();
        }
    }

    // 🚨 VERIFICAR COLISÕES
    checkCollisions() {
        if (!this.ball) return;
        
        // Colisão com plataforma
        if (this.checkPaddleCollision()) {
            this.handlePaddleCollision();
        }
        
        // Colisão com blocos
        this.checkBrickCollisions();
    }

    // 🏓 VERIFICAR COLISÃO COM PLATAFORMA
    checkPaddleCollision() {
        return this.ball.x + this.ball.size > this.paddle.x &&
               this.ball.x < this.paddle.x + this.paddle.width &&
               this.ball.y + this.ball.size > this.paddle.y &&
               this.ball.y < this.paddle.y + this.paddle.height;
    }

    // 🎯 MANIPULAR COLISÃO COM PLATAFORMA
    handlePaddleCollision() {
        // Calcula ponto de impacto na plataforma
        const hitPos = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
        
        // Ângulo baseado no ponto de impacto
        const angle = hitPos * Math.PI / 3; // ±60 graus
        
        // Nova direção
        this.ball.dx = Math.sin(angle) * this.config.ballSpeed;
        this.ball.dy = -Math.cos(angle) * this.config.ballSpeed;
        
        // Garante que a bola saia da plataforma
        this.ball.y = this.paddle.y - this.ball.size;
    }

    // 🧱 VERIFICAR COLISÕES COM BLOCOS
    checkBrickCollisions() {
        for (let i = this.bricks.length - 1; i >= 0; i--) {
            const brick = this.bricks[i];
            
            if (this.checkBrickCollision(brick)) {
                this.handleBrickCollision(brick, i);
                break; // Uma colisão por frame
            }
        }
    }

    // 🔍 VERIFICAR COLISÃO COM BLOCO ESPECÍFICO
    checkBrickCollision(brick) {
        return this.ball.x + this.ball.size > brick.x &&
               this.ball.x < brick.x + brick.width &&
               this.ball.y + this.ball.size > brick.y &&
               this.ball.y < brick.y + brick.height;
    }

    // 💥 MANIPULAR COLISÃO COM BLOCO
    handleBrickCollision(brick, brickIndex) {
        // Determina direção da colisão
        const ballCenterX = this.ball.x + this.ball.size / 2;
        const ballCenterY = this.ball.y + this.ball.size / 2;
        const brickCenterX = brick.x + brick.width / 2;
        const brickCenterY = brick.y + brick.height / 2;
        
        const dx = ballCenterX - brickCenterX;
        const dy = ballCenterY - brickCenterY;
        const width = (this.ball.size + brick.width) / 2;
        const height = (this.ball.size + brick.height) / 2;
        const crossWidth = width * dy;
        const crossHeight = height * dx;
        
        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (crossWidth > crossHeight) {
                this.ball.dy = -this.ball.dy; // Colisão vertical
            } else {
                this.ball.dx = -this.ball.dx; // Colisão horizontal
            }
        }
        
        // Remove o bloco e adiciona pontos
        this.bricks.splice(brickIndex, 1);
        this.score += 100;
        
        this.updateGameDisplay();
    }

    // 💔 PERDER VIDA
    loseLife() {
        this.lives--;
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.initBall();
        }
        
        this.updateGameDisplay();
    }

    // 🏓 INICIALIZAR PLATAFORMA
    initPaddle() {
        this.paddle = {
            x: this.config.width / 2 - this.config.paddleWidth / 2,
            y: this.config.height - 40,
            width: this.config.paddleWidth,
            height: this.config.paddleHeight,
            color: '#4CAF50'
        };
    }

    // 🎾 INICIALIZAR BOLA
    initBall() {
        this.ball = {
            x: this.config.width / 2,
            y: this.config.height - 60,
            dx: (Math.random() - 0.5) * this.config.ballSpeed,
            dy: -this.config.ballSpeed,
            size: this.config.ballSize,
            color: '#FFFFFF'
        };
    }

    // 🧱 CRIAR BLOCOS
    createBricks() {
        this.bricks = [];
        const rows = 5;
        const cols = 8;
        const brickWidth = 80;
        const brickHeight = 30;
        const padding = 5;
        
        const offsetX = (this.config.width - (cols * (brickWidth + padding))) / 2;
        const offsetY = 60;
        
        const colors = ['#f44336', '#FF9800', '#FFD700', '#4CAF50', '#2196F3'];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.bricks.push({
                    x: offsetX + col * (brickWidth + padding),
                    y: offsetY + row * (brickHeight + padding),
                    width: brickWidth,
                    height: brickHeight,
                    color: colors[row]
                });
            }
        }
    }

    // 🏆 VERIFICAR SE NÍVEL FOI COMPLETADO
    checkLevelComplete() {
        if (this.bricks.length === 0 && this.gameState === 'running') {
            this.levelComplete();
        }
    }

    // 🎉 NÍVEL COMPLETO
    levelComplete() {
        this.level++;
        this.score += 1000;
        
        // Cria novo nível
        this.createBricks();
        this.initBall();
        
        this.updateGameDisplay();
        console.log('🎉 Level complete! Moving to level', this.level);
    }

    // ⏸️ PAUSAR/DESPAUSAR
    togglePause() {
        if (this.gameState === 'running') {
            this.gameState = 'paused';
            document.getElementById('pause-overlay').style.display = 'flex';
        } else if (this.gameState === 'paused') {
            this.gameState = 'running';
            document.getElementById('pause-overlay').style.display = 'none';
            this.startGameLoop();
        }
    }

    // ⏹️ PARAR JOGO
    stopGame() {
        this.gameState = 'stopped';
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
        document.getElementById('pause-overlay').style.display = 'none';
    }

    // 💀 GAME OVER
    gameOver() {
        this.stopGame();
        
        // Salva score
        if (window.gamePlatform) {
            window.gamePlatform.saveScore('Jogador', 'arkanoid', this.score);
        }
        
        alert(`💀 Game Over!\nScore: ${this.score}\nLevel: ${this.level}`);
        
        this.reset();
    }

    // 🖼️ DESENHAR JOGO
    draw() {
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        
        // Desenha background
        this.drawBackground();
        
        // Desenha elementos
        this.drawBricks();
        this.drawPaddle();
        this.drawBall();
    }

    // 🎨 DESENHAR BACKGROUND
    drawBackground() {
        // Fundo gradiente
        const gradient = this.ctx.createLinearGradient(0, 0, this.config.width, this.config.height);
        gradient.addColorStop(0, '#0f1f2f');
        gradient.addColorStop(1, '#1a2f3f');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }

    // 🧱 DESENHAR BLOCOS
    drawBricks() {
        this.bricks.forEach(brick => {
            this.ctx.fillStyle = brick.color;
            this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            
            // Borda
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        });
    }

    // 🏓 DESENHAR PLATAFORMA
    drawPaddle() {
        if (!this.paddle) return;
        
        this.ctx.fillStyle = this.paddle.color;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Borda
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    }

    // 🎾 DESENHAR BOLA
    drawBall() {
        if (!this.ball) return;
        
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x + this.ball.size / 2, this.ball.y + this.ball.size / 2, this.ball.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Borda
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    // 📊 ATUALIZAR DISPLAY
    updateGameDisplay() {
        const scoreElement = document.getElementById('arkanoid-score');
        const levelElement = document.getElementById('arkanoid-level');
        const livesElement = document.getElementById('arkanoid-lives');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (levelElement) levelElement.textContent = this.level;
        if (livesElement) livesElement.textContent = this.lives;
    }

    // 🧹 DESTRUIR JOGO
    destroy() {
        this.stopGame();
    }
}