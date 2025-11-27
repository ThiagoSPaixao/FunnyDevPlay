// 🏓 ARKANOID PREMIUM - VERSÃO COMPLETA MOBILE

export default class ArkanoidGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Arkanoid Premium";
        this.version = "2.1";
        
        // 🎯 CONFIGURAÇÕES
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
        this.highScore = localStorage.getItem('arkanoidHighScore') || 0;
        
        // 🏓 Elementos do jogo
        this.paddle = null;
        this.balls = [];
        this.bricks = [];
        
        // 📱 Mobile
        this.isMobile = this.detectMobile();
        this.touchX = 0;
        this.isTouching = false;
        
        // 🔧 Referências
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        
        // 🎯 Controles
        this.keys = {};
        this.mouseX = 0;
        
        console.log('🏓 Arkanoid Premium criado!');
    }

    // 📱 DETECTAR MOBILE
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth <= 768;
    }

    async init() {
        console.log('🎮 Inicializando Arkanoid Premium...');
        
        try {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Configuração responsiva
            this.setupResponsiveCanvas();
            
            console.log('📐 Canvas configurado:', this.canvas.width, 'x', this.canvas.height);
            
            this.createGameInterface();
            this.setupControls();
            this.reset();
            
            console.log('✅ Arkanoid Premium inicializado!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Arkanoid:', error);
            throw error;
        }
    }

    // 🎯 CONFIGURAR CANVAS RESPONSIVO
    setupResponsiveCanvas() {
        if (this.isMobile) {
            const maxWidth = Math.min(800, window.innerWidth * 0.95);
            const scale = maxWidth / this.config.width;
            
            this.canvas.style.width = `${maxWidth}px`;
            this.canvas.style.height = `${this.config.height * scale}px`;
            
            // Canvas nativo
            this.canvas.width = maxWidth;
            this.canvas.height = this.config.height * scale;
            
            // Atualiza configurações
            this.config.width = maxWidth;
            this.config.height = this.config.height * scale;
            this.config.paddleWidth = maxWidth * 0.125;
            this.config.ballSize = maxWidth * 0.0125;
        } else {
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
        }
    }

    // 🎨 CRIAR INTERFACE DO JOGO
    createGameInterface() {
        const gameContainer = document.getElementById('game-container');
        
        gameContainer.innerHTML = `
            <div class="arkanoid-game">
                <div class="arkanoid-header">
                    <h2>🏓 Arkanoid ${this.isMobile ? '📱' : ''}</h2>
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
                    <div class="stat-item">
                        <span class="stat-label">Recorde</span>
                        <span id="arkanoid-highscore" class="stat-value">${this.highScore}</span>
                    </div>
                </div>

                <div class="arkanoid-container">
                    <canvas id="game-canvas"></canvas>
                    <div id="pause-overlay" class="pause-overlay" style="display: none;">
                        <div class="pause-content">
                            <div class="pause-title">⏸️ PAUSED</div>
                            <div class="pause-subtitle">${this.isMobile ? 'Tap' : 'Click'} to continue</div>
                        </div>
                    </div>
                </div>

                <div class="arkanoid-controls">
                    <div class="control-buttons">
                        <button id="arkanoid-start" class="arkanoid-btn">▶️ Iniciar</button>
                        <button id="arkanoid-pause" class="arkanoid-btn">⏸️ Pausar</button>
                        <button id="arkanoid-reset" class="arkanoid-btn">🔄 Reiniciar</button>
                    </div>
                    <div style="margin-top: 10px; color: white; font-size: 14px; text-align: center;">
                        ${this.isMobile ? 
                          'Controles: Arraste na tela para mover' : 
                          'Controles: Mouse ou Setas ← →'
                        }
                    </div>
                </div>
            </div>

            ${this.isMobile ? `
            <div class="touch-controls">
                <div class="touch-pad" id="touch-pad">
                    <div style="color: rgba(255,255,255,0.7); text-align: center; padding: 25px; font-size: 14px;">
                        ⬅️ Arraste para mover ➡️
                    </div>
                </div>
            </div>
            ` : ''}
        `;
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        if (this.isMobile) {
            this.setupResponsiveCanvas();
        } else {
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
        }
        
        this.setupGameControls();
    }

    // 🎮 CONFIGURAR CONTROLES DO JOGO
    setupGameControls() {
        document.getElementById('arkanoid-start').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('arkanoid-pause').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('arkanoid-reset').addEventListener('click', () => {
            this.reset();
        });

        // 📱 Eventos touch para botões
        if (this.isMobile) {
            const buttons = document.querySelectorAll('.arkanoid-btn');
            buttons.forEach(btn => {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    btn.click();
                });
            });
        }
    }

    // ⌨️ CONFIGURAR CONTROLES
    setupControls() {
        // Controles de teclado (apenas desktop)
        if (!this.isMobile) {
            document.addEventListener('keydown', (e) => {
                this.keys[e.key] = true;
            });
            
            document.addEventListener('keyup', (e) => {
                this.keys[e.key] = false;
            });
            
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
            });
        }
        
        // Click para pause
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'paused') {
                this.togglePause();
            }
        });

        // 📱 CONFIGURAR CONTROLES TOUCH
        if (this.isMobile) {
            this.setupTouchControls();
        }
    }

    // 📱 CONFIGURAR CONTROLES TOUCH
    setupTouchControls() {
        const touchPad = document.getElementById('touch-pad');
        let isDragging = false;

        touchPad.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            this.isTouching = true;
            this.updatePaddleFromTouch(e.touches[0]);
        });

        touchPad.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isDragging) {
                this.updatePaddleFromTouch(e.touches[0]);
            }
        });

        touchPad.addEventListener('touchend', (e) => {
            e.preventDefault();
            isDragging = false;
            this.isTouching = false;
        });

        // Também permite tocar diretamente no canvas
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.updatePaddleFromTouch(e.touches[0]);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.updatePaddleFromTouch(e.touches[0]);
        });
    }

    // 📱 ATUALIZAR PLATAFORMA POR TOUCH
    updatePaddleFromTouch(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        
        // Converte coordenada de touch para coordenada do canvas
        const canvasX = (touchX / this.canvas.clientWidth) * this.config.width;
        this.updatePaddlePosition(canvasX);
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
        if (this.isMobile) {
            // Em mobile, usa apenas touch (já processado nos event listeners)
            return;
        }
        
        // Desktop: teclado e mouse
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.paddle.x -= 8;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.paddle.x += 8;
        }
        
        if (this.mouseX > 0) {
            this.paddle.x = this.mouseX - this.paddle.width / 2;
        }
        
        this.paddle.x = Math.max(0, Math.min(this.config.width - this.paddle.width, this.paddle.x));
    }

    // 🏓 ATUALIZAR PLATAFORMA
    updatePaddle() {
        // Já atualizado no processInput
    }

    // 🎾 ATUALIZAR BOLA
    updateBall() {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            
            ball.x += ball.dx;
            ball.y += ball.dy;
            
            // Colisão com paredes
            if (ball.x <= 0 || ball.x >= this.config.width - ball.size) {
                ball.dx = -ball.dx;
            }
            
            // Colisão com teto
            if (ball.y <= 0) {
                ball.dy = -ball.dy;
            }
            
            // Colisão com chão (perde vida)
            if (ball.y >= this.config.height) {
                this.balls.splice(i, 1);
                
                // Se não há mais bolas, perde vida
                if (this.balls.length === 0) {
                    this.loseLife();
                }
                continue;
            }
        }
    }

    // 🚨 VERIFICAR COLISÕES
    checkCollisions() {
        this.balls.forEach(ball => {
            // Colisão com plataforma
            if (this.checkPaddleCollision(ball)) {
                this.handlePaddleCollision(ball);
            }
            
            // Colisão com blocos
            this.checkBrickCollisions(ball);
        });
    }

    // 🏓 VERIFICAR COLISÃO COM PLATAFORMA
    checkPaddleCollision(ball) {
        return ball.x + ball.size > this.paddle.x &&
               ball.x < this.paddle.x + this.paddle.width &&
               ball.y + ball.size > this.paddle.y &&
               ball.y < this.paddle.y + this.paddle.height;
    }

    // 🎯 MANIPULAR COLISÃO COM PLATAFORMA
    handlePaddleCollision(ball) {
        // Calcula ponto de impacto na plataforma
        const hitPos = (ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
        
        // Ângulo baseado no ponto de impacto
        const angle = hitPos * Math.PI / 3; // ±60 graus
        
        // Nova direção
        ball.dx = Math.sin(angle) * this.config.ballSpeed;
        ball.dy = -Math.cos(angle) * this.config.ballSpeed;
        
        // Garante que a bola saia da plataforma
        ball.y = this.paddle.y - ball.size;
    }

    // 🧱 VERIFICAR COLISÕES COM BLOCOS
    checkBrickCollisions(ball) {
        for (let i = this.bricks.length - 1; i >= 0; i--) {
            const brick = this.bricks[i];
            
            if (this.checkBrickCollision(ball, brick)) {
                this.handleBrickCollision(ball, brick, i);
                break; // Uma colisão por frame
            }
        }
    }

    // 🔍 VERIFICAR COLISÃO COM BLOCO ESPECÍFICO
    checkBrickCollision(ball, brick) {
        return ball.x + ball.size > brick.x &&
               ball.x < brick.x + brick.width &&
               ball.y + ball.size > brick.y &&
               ball.y < brick.y + brick.height;
    }

    // 💥 MANIPULAR COLISÃO COM BLOCO
    handleBrickCollision(ball, brick, brickIndex) {
        // Determina direção da colisão
        const ballCenterX = ball.x + ball.size / 2;
        const ballCenterY = ball.y + ball.size / 2;
        const brickCenterX = brick.x + brick.width / 2;
        const brickCenterY = brick.y + brick.height / 2;
        
        const dx = ballCenterX - brickCenterX;
        const dy = ballCenterY - brickCenterY;
        const width = (ball.size + brick.width) / 2;
        const height = (ball.size + brick.height) / 2;
        const crossWidth = width * dy;
        const crossHeight = height * dx;
        
        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (crossWidth > crossHeight) {
                ball.dy = -ball.dy; // Colisão vertical
            } else {
                ball.dx = -ball.dx; // Colisão horizontal
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
        this.balls = [{
            x: this.config.width / 2,
            y: this.config.height - 60,
            dx: (Math.random() - 0.5) * this.config.ballSpeed,
            dy: -this.config.ballSpeed,
            size: this.config.ballSize,
            color: '#FFFFFF'
        }];
    }

    // 🧱 CRIAR BLOCOS
    createBricks() {
        this.bricks = [];
        const rows = 5;
        const cols = 8;
        const brickWidth = this.config.width * 0.1; // 10% da largura
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

    // 🏓 ATUALIZAR POSIÇÃO DA PLATAFORMA
    updatePaddlePosition(x) {
        if (!this.paddle) return;
        
        let newX = x - this.paddle.width / 2;
        newX = Math.max(0, Math.min(this.config.width - this.paddle.width, newX));
        this.paddle.x = newX;
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
        
        // Atualiza high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('arkanoidHighScore', this.highScore);
        }
        
        // Salva score
        if (window.gamePlatform) {
            window.gamePlatform.saveScore('Jogador', 'arkanoid', this.score);
        }
        
        // Mostra alerta
        setTimeout(() => {
            alert(`💀 Game Over!\nScore: ${this.score}\nLevel: ${this.level}`);
            this.reset();
        }, 500);
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
        this.balls.forEach(ball => {
            this.ctx.fillStyle = ball.color;
            this.ctx.beginPath();
            this.ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Borda
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    // 📊 ATUALIZAR DISPLAY
    updateGameDisplay() {
        document.getElementById('arkanoid-score').textContent = this.score;
        document.getElementById('arkanoid-level').textContent = this.level;
        document.getElementById('arkanoid-lives').textContent = this.lives;
        document.getElementById('arkanoid-highscore').textContent = this.highScore;
    }

    // 🧹 DESTRUIR JOGO
    destroy() {
        this.stopGame();
    }
}