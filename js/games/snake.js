// 🐍 SNAKE GAME - VERSÃO PREMIUM COM GRÁFICOS INCRÍVEIS

export default class SnakeGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Snake Premium";
        this.version = "3.0";
        
        // 🎯 CONFIGURAÇÕES AVANÇADAS
        this.config = {
            width: 500,  // 🖼️ MAIOR para mais detalhes
            height: 500,
            gridSize: 25, // 🎨 MAIS ESPAÇO para gráficos detalhados
            speed: 120,
            frameRate: 60
        };
        
        // 🎮 Estado do jogo
        this.gameState = 'stopped';
        this.score = 0;
        this.highScore = 0;
        
        // 🐍 Dados da cobrinha
        this.snake = [];
        this.direction = 'right';
        this.nextDirection = 'right';
        
        // 🍎 Dados da comida
        this.food = { x: 0, y: 0 };
        this.foodTypes = ['apple', 'berry', 'coin', 'crystal']; // 🎨 DIFERENTES tipos de comida
        
        // ✨ EFEITOS VISUAIS
        this.particles = [];
        this.animations = [];
        
        // 🔧 Referências técnicas
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        this.lastUpdateTime = 0;
        this.deltaTime = 0;
        
        // 🎨 ASSETS (cores e gradientes)
        this.colors = {
            background: '#0f1f2f',
            grid: '#1a2f3f',
            snakeHead: '#4CAF50',
            snakeBody: '#8BC34A',
            food: '#FF5252',
            particle: '#FFD700',
            ui: '#FFFFFF'
        };
        
        console.log('🐍 Snake Premium criado!');
    }

    async init() {
        console.log('🎮 Inicializando Snake Premium...');
        
        try {
            // Configuração do canvas
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // 🎯 CONFIGURAÇÕES DE QUALIDADE
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            this.canvas.style.imageRendering = 'auto';
            
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
            
            // 🎨 CARREGA RECURSOS VISUAIS
            await this.loadVisualAssets();
            
            // Cria os controles
            this.createPremiumControls();
            
            // Configura controles
            this.setupControls();
            
            // Inicializa o jogo
            this.reset();
            
            // Inicia o game loop
            this.startSmoothGameLoop();
            
            console.log('✅ Snake Premium inicializado!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Snake:', error);
            throw error;
        }
    }

    // 🎨 CARREGA ASSETS VISUAIS
    async loadVisualAssets() {
        console.log('🖼️ Carregando assets visuais...');
        
        // 🎯 Podemos carregar imagens aqui no futuro
        // Por enquanto usaremos gráficos vetoriais avançados
        
        return new Promise((resolve) => {
            // Simula carregamento de assets
            setTimeout(resolve, 100);
        });
    }

    // 🎮 CONTROLES PREMIUM
    // 🎮 CONTROLES PREMIUM - VERSÃO ATUALIZADA COM TOUCH
createPremiumControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'game-controls premium-controls';
    controlsDiv.innerHTML = `
        <div class="controls-header">
            <h3>🐍 Snake Premium</h3>
        </div>
        <div class="controls-row">
            <button id="start-btn" class="control-btn premium-btn">▶️ Iniciar</button>
            <button id="pause-btn" class="control-btn premium-btn">⏸️ Pausar</button>
            <button id="reset-btn" class="control-btn premium-btn">🔄 Reiniciar</button>
        </div>
        <div class="stats-container">
            <div class="stat-box">
                <span class="stat-label">Score</span>
                <span id="current-score" class="stat-value">0</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">Recorde</span>
                <span id="high-score" class="stat-value">0</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">FPS</span>
                <span id="fps-counter" class="stat-value">0</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">Tamanho</span>
                <span id="snake-size" class="stat-value">3</span>
            </div>
        </div>
        <div class="speed-controls">
            <label for="speed-slider" class="speed-label">🎚️ Velocidade:</label>
            <input type="range" id="speed-slider" min="50" max="200" value="100" class="speed-slider">
            <span id="speed-value" class="speed-value">Normal</span>
        </div>
        <div class="premium-features">
            <div class="feature-tag">✨ Gráficos HD</div>
            <div class="feature-tag">🎯 Controles Suaves</div>
            <div class="feature-tag">🌟 Efeitos Visuais</div>
            <div class="feature-tag">📱 Controles Touch</div>  <!-- 🆕 NOVO FEATURE TAG -->
        </div>
        
        <!-- 🆕 NOVO: Indicador de controles mobile -->
        <div class="mobile-indicator" id="mobile-indicator" style="display: none;">
            📱 Controles Touch Ativos
        </div>
    `;
    
    this.canvas.parentNode.insertBefore(controlsDiv, this.canvas.nextSibling);
    this.setupControlButtons();
    this.setupSpeedControl();
    
    // 🆕 NOVA LINHA: Configura controles touch automaticamente
    this.setupTouchControls();
}

    setupControlButtons() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startSmoothGameLoop();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
            this.startSmoothGameLoop();
        });
    }

    setupSpeedControl() {
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            this.config.speed = 250 - speed;
            
            if (speed < 80) speedValue.textContent = 'Lento';
            else if (speed < 120) speedValue.textContent = 'Normal';
            else if (speed < 160) speedValue.textContent = 'Rápido';
            else speedValue.textContent = 'Turbo';
        });
    }

    // ⌨️ Controles
    // ⌨️ Controles - VERSÃO COMPLETA COM TOUCH
setupControls() {
    // 🎯 Controles de teclado
    document.addEventListener('keydown', (event) => {
        this.handleKeyPress(event);
    });
    
    // 📱 Controles Touch para mobile
    this.setupTouchControls();
}

// 📱 CONFIGURAR CONTROLES TOUCH
setupTouchControls() {
    console.log('📱 Configurando controles touch...');
    
    // 🎯 Cria os controles touch na tela
    this.createTouchControls();
    
    // 🎯 Eventos de touch para swipes
    this.setupTouchEvents();
}

// 🎮 CRIAR CONTROLES VIRTUAIS NA TELA
createTouchControls() {
    // 🎯 Verifica se é mobile
    if (!this.isMobileDevice()) return;
    
    const gameContainer = document.getElementById('game-container');
    
    // 🎯 Cria container dos controles touch
    const touchControls = document.createElement('div');
    touchControls.className = 'touch-controls';
    touchControls.innerHTML = `
        <div class="d-pad">
            <div class="d-pad-row">
                <button class="touch-btn up" data-direction="up">⬆️</button>
            </div>
            <div class="d-pad-row">
                <button class="touch-btn left" data-direction="left">⬅️</button>
                <button class="touch-btn center">○</button>
                <button class="touch-btn right" data-direction="right">➡️</button>
            </div>
            <div class="d-pad-row">
                <button class="touch-btn down" data-direction="down">⬇️</button>
            </div>
        </div>
        <div class="action-buttons">
            <button class="action-btn pause" id="touch-pause">⏸️</button>
            <button class="action-btn restart" id="touch-restart">🔄</button>
        </div>
    `;
    
    gameContainer.appendChild(touchControls);
    
    // 🎯 Configura eventos dos botões touch
    this.setupTouchButtons();
}

// 🎯 CONFIGURAR BOTÕES TOUCH
setupTouchButtons() {
    // 🎯 Botões de direção
    const touchButtons = document.querySelectorAll('.touch-btn[data-direction]');
    touchButtons.forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const direction = btn.getAttribute('data-direction');
            this.handleTouchDirection(direction);
        });
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const direction = btn.getAttribute('data-direction');
            this.handleTouchDirection(direction);
        });
    });
    
    // 🎯 Botões de ação
    document.getElementById('touch-pause').addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.togglePause();
    });
    
    document.getElementById('touch-restart').addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.reset();
        this.startSmoothGameLoop();
    });
}

// 📱 EVENTOS DE SWIPE
setupTouchEvents() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
    });
    
    this.canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // 🎯 Detecta a direção do swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Swipe horizontal
            if (diffX > 30 && this.direction !== 'left') {
                this.nextDirection = 'right';
            } else if (diffX < -30 && this.direction !== 'right') {
                this.nextDirection = 'left';
            }
        } else {
            // Swipe vertical
            if (diffY > 30 && this.direction !== 'up') {
                this.nextDirection = 'down';
            } else if (diffY < -30 && this.direction !== 'down') {
                this.nextDirection = 'up';
            }
        }
    });
}

// 🎯 MANIPULAR DIREÇÃO TOUCH
handleTouchDirection(direction) {
    if (this.gameState !== 'running') return;
    
    // 🎯 Previne mudanças de direção opostas
    if ((direction === 'up' && this.direction !== 'down') ||
        (direction === 'down' && this.direction !== 'up') ||
        (direction === 'left' && this.direction !== 'right') ||
        (direction === 'right' && this.direction !== 'left')) {
        this.nextDirection = direction;
    }
}

// 📱 DETECTAR SE É DISPOSITIVO MOBILE
isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
}

    handleKeyPress(event) {
        let newDirection = null;
        
        switch(event.key) {
            case 'ArrowUp': case 'w': case 'W': if (this.direction !== 'down') newDirection = 'up'; break;
            case 'ArrowDown': case 's': case 'S': if (this.direction !== 'up') newDirection = 'down'; break;
            case 'ArrowLeft': case 'a': case 'A': if (this.direction !== 'right') newDirection = 'left'; break;
            case 'ArrowRight': case 'd': case 'D': if (this.direction !== 'left') newDirection = 'right'; break;
            case ' ': event.preventDefault(); this.togglePause(); break;
            case 'r': case 'R': event.preventDefault(); this.reset(); this.startSmoothGameLoop(); break;
        }
        
        if (newDirection && this.gameState === 'running') {
            this.nextDirection = newDirection;
        }
    }

    // 🔄 Reiniciar o jogo
    reset() {
        this.stop();
        
        const startX = Math.floor(this.config.width / this.config.gridSize / 2);
        const startY = Math.floor(this.config.height / this.config.gridSize / 2);
        
        this.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        
        this.direction = 'right';
        this.nextDirection = 'right';
        this.generateFood();
        this.score = 0;
        this.gameState = 'stopped';
        this.particles = [];
        this.animations = [];
        
        this.updateScoreDisplay();
        this.draw();
    }

    // 🍎 Gerar comida com tipo aleatório
    generateFood() {
        let newFood;
        let foodIsOnSnake;
        let attempts = 0;
        
        do {
            newFood = {
                x: Math.floor(Math.random() * (this.config.width / this.config.gridSize)),
                y: Math.floor(Math.random() * (this.config.height / this.config.gridSize)),
                type: this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)],
                rotation: 0
            };
            
            foodIsOnSnake = this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
            
            attempts++;
            if (attempts > 100) break;
            
        } while (foodIsOnSnake);
        
        this.food = newFood;
    }

    // 🚀 Game Loop Moderno - VERSÃO COMPLETAMENTE CORRIGIDA
    startSmoothGameLoop() {
        console.log('🎮 Iniciando/Reiniciando game loop...');
        console.log('📊 Estado atual:', this.gameState);
        
        // 🛑 PARA qualquer loop existente
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
            console.log('🛑 Loop anterior cancelado');
        }
        
        // 🎯 Só inicia se estiver em estado válido
        if (this.gameState === 'stopped' || this.gameState === 'gameover' || this.gameState === 'paused') {
            this.gameState = 'running';
            this.lastUpdateTime = performance.now();
            this.deltaTime = 0;
            
            console.log('✅ Estado alterado para: running');
            
            const gameLoop = (currentTime) => {
                // 🎯 VERIFICA se ainda deve continuar
                if (this.gameState !== 'running') {
                    console.log('🛑 Parando loop - estado:', this.gameState);
                    return;
                }
                
                this.deltaTime = currentTime - this.lastUpdateTime;
                
                // 🎯 ATUALIZAÇÃO do jogo (lógica principal)
                if (this.deltaTime >= this.config.speed) {
                    this.update();
                    this.lastUpdateTime = currentTime - (this.deltaTime % this.config.speed);
                }
                
                // 🎯🎯🎯 CORREÇÃO CRÍTICA: Atualiza partículas e animações A CADA FRAME!
                this.updateAnimations();
                this.updateParticles();
                
                // 🎯 RENDERIZAÇÃO (sempre)
                this.draw();
                this.updateFPSCounter();
                
                // 🎯 CONTINUA o loop
                this.gameLoop = requestAnimationFrame(gameLoop);
            };
            
            // 🚀 INICIA o loop
            this.gameLoop = requestAnimationFrame(gameLoop);
            console.log('✅ Game loop iniciado com sucesso!');
            
        } else {
            console.log('⚠️ Não é possível iniciar loop no estado:', this.gameState);
        }
    }

    // ✨ ATUALIZA ANIMAÇÕES
    updateAnimations() {
        this.animations = this.animations.filter(anim => {
            anim.progress += 0.05;
            return anim.progress < 1;
        });
    }

    // ✨ ATUALIZA PARTÍCULAS - VERSÃO SUPER SEGURA
    updateParticles() {
        // 🎯 Cria uma NOVA array só com partículas vivas
        const aliveParticles = [];
        
        this.particles.forEach(particle => {
            // 🎯 Atualiza posição
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // 🎯 VERIFICAÇÃO EXTRA: só adiciona se estiver VIVA e DENTRO da tela
            const isAlive = particle.life > 0;
            const isOnScreen = particle.x > -10 && particle.x < this.config.width + 10 && 
                              particle.y > -10 && particle.y < this.config.height + 10;
            
            if (isAlive && isOnScreen) {
                aliveParticles.push(particle);
            }
        });
        
        // 🎯 SUBSTITUI a array antiga pela nova
        this.particles = aliveParticles;
    }

    updateFPSCounter() {
        const fpsElement = document.getElementById('fps-counter');
        if (fpsElement && this.deltaTime > 0) {
            const fps = Math.round(1000 / this.deltaTime);
            fpsElement.textContent = Math.min(fps, 60);
        }
    }

    // ⏸️ Pausar/Despausar - VERSÃO SIMPLES E FUNCIONAL
    togglePause() {
        console.log('🎮 Pause/Despause solicitado');
        console.log('📊 Estado antes:', this.gameState);
        
        if (this.gameState === 'running') {
            // 🛑 PAUSAR
            this.gameState = 'paused';
            if (this.gameLoop) {
                cancelAnimationFrame(this.gameLoop);
                this.gameLoop = null;
            }
            console.log('✅ Jogo pausado');
            this.draw(); // Mostra tela de pausa
            
        } else if (this.gameState === 'paused') {
            // ▶️ DESPAUSAR - simplesmente reinicia o loop
            console.log('▶️ Reiniciando game loop...');
            this.startSmoothGameLoop();
            
        } else {
            console.log('⚠️ Estado inválido para pausa:', this.gameState);
        }
        
        console.log('📊 Estado depois:', this.gameState);
    }

    // ⏹️ Parar o jogo
    stop() {
        this.gameState = 'stopped';
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    // 🔄 Atualizar a lógica do jogo
    update() {
        this.direction = this.nextDirection;
        this.moveSnake();
        this.checkCollisions();
    }

    // 🐍 Mover a cobrinha
    moveSnake() {
        const head = { ...this.snake[0] };
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.createFoodParticles();
            this.generateFood();
            this.updateScoreDisplay();
        } else {
            this.snake.pop();
        }
    }

    // ✨ CRIAR PARTÍCULAS - VERSÃO CONTROLADA
    createFoodParticles() {
        const foodX = this.food.x * this.config.gridSize + this.config.gridSize / 2;
        const foodY = this.food.y * this.config.gridSize + this.config.gridSize / 2;
        
        console.log(`🍎 Criando partículas em: (${foodX}, ${foodY})`);
        
        // 🎯 LIMPEZA TOTAL antes de criar novas
        this.particles = [];
        
        // 🎯 Número controlado de partículas
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: foodX,
                y: foodY,
                vx: (Math.random() - 0.5) * 3, // 🎯 Velocidade reduzida
                vy: (Math.random() - 0.5) * 3,
                life: 25, // 🎯 Vida mais curta
                color: this.getParticleColor(),
                id: Date.now() + i // 🎯 ID único para debug
            });
        }
        
        console.log(`✨ Criadas ${this.particles.length} partículas`);
    }

    // 🎨 COR das partículas baseada no tipo de comida
    getParticleColor() {
        const colors = {
            'apple': '#FF5252',
            'berry': '#E91E63', 
            'coin': '#FFD700',
            'crystal': '#00BCD4'
        };
        return colors[this.food.type] || '#FFD700';
    }

    // 🚨 Verificar colisões
    checkCollisions() {
        const head = this.snake[0];
        
        if (head.x < 0 || head.x >= this.config.width / this.config.gridSize ||
            head.y < 0 || head.y >= this.config.height / this.config.gridSize) {
            this.gameOver();
            return;
        }
        
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }
    }

    // 💀 Game Over
    gameOver() {
        this.gameState = 'gameover';
        this.stop();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.updateScoreDisplay();
        }
        
        if (window.gamePlatform) {
            window.gamePlatform.saveScore('Jogador', 'snake', this.score);
        }
    }

    // 🎨 Atualizar display
    updateScoreDisplay() {
        const currentScoreElement = document.getElementById('current-score');
        const highScoreElement = document.getElementById('high-score');
        const snakeSizeElement = document.getElementById('snake-size');
        
        if (currentScoreElement) currentScoreElement.textContent = this.score;
        if (highScoreElement) highScoreElement.textContent = this.highScore;
        if (snakeSizeElement) snakeSizeElement.textContent = this.snake.length;
    }

    // 🎨🎨🎨 DESENHOS PREMIUM - Gráficos Incríveis!

    draw() {
        this.drawBackground();
        this.drawGrid();
        this.drawSnake();
        this.drawFood();
        this.drawParticles();
        this.drawUI();
        
        if (this.gameState === 'gameover') {
            this.drawGameOver();
        }
    }

    // 🖼️ FUNDO GRADIENTE
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.config.width, this.config.height);
        gradient.addColorStop(0, '#0f1f2f');
        gradient.addColorStop(1, '#1a2f3f');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }

    // 🔲 GRADE ESTILIZADA
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.config.width; x += this.config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.config.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.config.height; y += this.config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.config.width, y);
            this.ctx.stroke();
        }
    }

    // 🐍 COBRA 3D ESTILIZADA
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.config.gridSize;
            const y = segment.y * this.config.gridSize;
            const size = this.config.gridSize - 2;
            
            if (index === 0) {
                // 🐍 CABEÇA - Design Premium
                this.drawSnakeHead(x, y, size);
            } else {
                // 🐍 CORPO - Gradiente Suave
                this.drawSnakeBody(x, y, size, index);
            }
        });
    }

    // 🐍 CABEÇA DETALHADA
    drawSnakeHead(x, y, size) {
        // 🎯 CORPO da cabeça
        const headGradient = this.ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, size/2
        );
        headGradient.addColorStop(0, '#4CAF50');
        headGradient.addColorStop(1, '#388E3C');
        
        this.ctx.fillStyle = headGradient;
        this.roundRect(x, y, size, size, 6);
        this.ctx.fill();
        
        // 👀 OLHOS
        this.drawSnakeEyes(x, y, size);
        
        // 👅 LÍNGUA (se movendo)
        this.drawSnakeTongue(x, y, size);
    }

    // 🐍 CORPO COM GRADIENTE
    drawSnakeBody(x, y, size, index) {
        const intensity = 1 - (index / this.snake.length) * 0.4;
        const bodyGradient = this.ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, size/2
        );
        bodyGradient.addColorStop(0, `rgba(139, 195, 74, ${intensity})`);
        bodyGradient.addColorStop(1, `rgba(76, 175, 80, ${intensity * 0.7})`);
        
        this.ctx.fillStyle = bodyGradient;
        this.roundRect(x, y, size, size, 4);
        this.ctx.fill();
        
        // 🎯 DETALHES do corpo
        this.ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.2})`;
        this.ctx.fillRect(x + 2, y + 2, size - 4, 2);
    }

    // 👀 OLHOS ANIMADOS
    drawSnakeEyes(x, y, size) {
        this.ctx.fillStyle = '#000';
        
        let leftEye, rightEye;
        const eyeSize = size * 0.15;
        
        switch(this.direction) {
            case 'right':
                leftEye = { x: x + size - eyeSize * 2, y: y + eyeSize * 2 };
                rightEye = { x: x + size - eyeSize * 2, y: y + size - eyeSize * 3 };
                break;
            case 'left':
                leftEye = { x: x + eyeSize, y: y + eyeSize * 2 };
                rightEye = { x: x + eyeSize, y: y + size - eyeSize * 3 };
                break;
            case 'up':
                leftEye = { x: x + eyeSize * 2, y: y + eyeSize };
                rightEye = { x: x + size - eyeSize * 3, y: y + eyeSize };
                break;
            case 'down':
                leftEye = { x: x + eyeSize * 2, y: y + size - eyeSize * 2 };
                rightEye = { x: x + size - eyeSize * 3, y: y + size - eyeSize * 2 };
                break;
        }
        
        // 👁️ OLHOS
        this.ctx.beginPath();
        this.ctx.arc(leftEye.x, leftEye.y, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(rightEye.x, rightEye.y, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // ✨ BRILHO nos olhos
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(leftEye.x - eyeSize/3, leftEye.y - eyeSize/3, eyeSize/3, 0, Math.PI * 2);
        this.ctx.arc(rightEye.x - eyeSize/3, rightEye.y - eyeSize/3, eyeSize/3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 👅 LÍNGUA ANIMADA
    drawSnakeTongue(x, y, size) {
        if (this.direction === 'right' || this.direction === 'left') {
            const tongueX = this.direction === 'right' ? x + size : x;
            const baseY = y + size / 2;
            const tongueLength = size * 0.8;
            const wave = Math.sin(Date.now() * 0.01) * 3;
            
            this.ctx.strokeStyle = '#FF4081';
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(tongueX, baseY);
            this.ctx.lineTo(tongueX + (this.direction === 'right' ? tongueLength : -tongueLength), baseY + wave);
            this.ctx.stroke();
        }
    }

    // 🍎 COMIDA 3D ANIMADA
    drawFood() {
        const x = this.food.x * this.config.gridSize;
        const y = this.food.y * this.config.gridSize;
        const size = this.config.gridSize - 2;
        
        // 🎯 ROTAÇÃO suave
        this.food.rotation += 0.02;
        
        this.ctx.save();
        this.ctx.translate(x + size/2, y + size/2);
        this.ctx.rotate(this.food.rotation);
        
        switch(this.food.type) {
            case 'apple':
                this.drawApple(-size/2, -size/2, size);
                break;
            case 'berry':
                this.drawBerry(-size/2, -size/2, size);
                break;
            case 'coin':
                this.drawCoin(-size/2, -size/2, size);
                break;
            case 'crystal':
                this.drawCrystal(-size/2, -size/2, size);
                break;
        }
        
        this.ctx.restore();
    }

    // 🍎 MAÇÃ 3D
    drawApple(x, y, size) {
        const gradient = this.ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, size/2
        );
        gradient.addColorStop(0, '#FF5252');
        gradient.addColorStop(1, '#D32F2F');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 🍃 CABINHO
        this.ctx.fillStyle = '#388E3C';
        this.ctx.fillRect(x + size/2 - 1, y, 2, 4);
    }

    // 🫐 BAGA
    drawBerry(x, y, size) {
        const gradient = this.ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, size/2
        );
        gradient.addColorStop(0, '#E91E63');
        gradient.addColorStop(1, '#C2185B');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // ✨ PONTOS
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.arc(x + size/3 + (i * size/3), y + size/3, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // 🪙 MOEDA
    drawCoin(x, y, size) {
        const gradient = this.ctx.createRadialGradient(
            x + size/2, y + size/2, 0,
            x + size/2, y + size/2, size/2
        );
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA000');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 💰 DETALHE da moeda
        this.ctx.strokeStyle = '#FFA000';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/2 - 2, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    // 💎 CRISTAL
    drawCrystal(x, y, size) {
        this.ctx.fillStyle = '#00BCD4';
        this.ctx.beginPath();
        this.ctx.moveTo(x + size/2, y);
        this.ctx.lineTo(x + size, y + size/2);
        this.ctx.lineTo(x + size/2, y + size);
        this.ctx.lineTo(x, y + size/2);
        this.ctx.closePath();
        this.ctx.fill();
        
        // ✨ BRILHO
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    // ✨ PARTÍCULAS - DESENHO CORRIGIDO
    drawParticles() {
        // 🎯 RETORNA IMEDIATAMENTE se não há partículas
        if (!this.particles || this.particles.length === 0) {
            return;
        }
        
        this.particles.forEach(particle => {
            // 🎯 VERIFICAÇÃO DUPLA: só desenha se estiver viva
            if (particle.life <= 0) return;
            
            // 🎯 Calcula opacidade e tamanho
            const progress = particle.life / 25; // Vida máxima é 25
            const opacity = Math.max(0, progress);
            const size = Math.max(0.5, 2 * progress);
            
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = opacity;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 🎯 GARANTE que a opacidade volta ao normal
        this.ctx.globalAlpha = 1;
    }

    // 📊 INTERFACE PREMIUM
    drawUI() {
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.config.width, this.config.height);
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 28px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('⏸️ PAUSADO', this.config.width / 2, this.config.height / 2);
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Pressione ESPAÇO para continuar', this.config.width / 2, this.config.height / 2 + 40);
            this.ctx.textAlign = 'left';
        }
    }

    // 💀 GAME OVER ESTILIZADO
    drawGameOver() {
        // 🎭 FUNDO escurecido
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
        
        // 💀 TEXTO principal
        this.ctx.fillStyle = '#FF5252';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('💀 GAME OVER', this.config.width / 2, this.config.height / 2 - 40);
        
        // 📊 SCORE
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.config.width / 2, this.config.height / 2);
        
        // 🏆 HIGH SCORE
        if (this.score === this.highScore && this.highScore > 0) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '20px Arial';
            this.ctx.fillText('🎉 NOVO RECORDE!', this.config.width / 2, this.config.height / 2 + 30);
        }
        
        // 🎮 INSTRUÇÕES
        this.ctx.fillStyle = '#BBBBBB';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Pressione R para jogar novamente', this.config.width / 2, this.config.height / 2 + 70);
        
        this.ctx.textAlign = 'left';
    }

    // 🛠️ UTILITÁRIO: Retângulo arredondado
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    destroy() {
        this.stop();
    }
}