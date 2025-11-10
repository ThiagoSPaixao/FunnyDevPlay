// 🐍 SNAKE GAME - VERSÃO ULTRA FLUIDA

export default class SnakeGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Snake Classic Pro";
        this.version = "2.0";
        
        // 🎯 CONFIGURAÇÕES OTIMIZADAS
        this.config = {
            width: 400,
            height: 400,
            gridSize: 20,
            speed: 100, // 🚀 MAIS RÁPIDO = MAIS FLUIDO
            frameRate: 60 // 🎯 ALTA TAXA DE ATUALIZAÇÃO
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
        
        // 🔧 Referências técnicas OTIMIZADAS
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        this.lastUpdateTime = 0;
        this.deltaTime = 0;
        
        // 🎯 BUFFER para movimento suave
        this.pendingMove = null;
        this.moveQueue = [];
        
        console.log('🐍 Snake Game ULTRA FLUIDO criado!');
    }

    async init() {
        console.log('🎮 Inicializando Snake Game Fluido...');
        
        try {
            // Configuração do canvas
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // 🎯 OTIMIZAÇÃO: Configurações de performance
            this.ctx.imageSmoothingEnabled = false; // Pixels nítidos
            this.canvas.style.imageRendering = 'pixelated'; // Visual retro
            
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
            
            // Cria os controles
            this.createGameControls();
            
            // Configura controles
            this.setupControls();
            
            // Inicializa o jogo
            this.reset();
            
            // 🎯 INICIA COM GAME LOOP MODERNO
            this.startSmoothGameLoop();
            
            console.log('✅ Snake Game Fluido inicializado!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Snake:', error);
            throw error;
        }
    }

    // 🎮 Cria controles visuais
    createGameControls() {
        const gameContainer = document.getElementById('game-container');
        
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'game-controls';
        controlsDiv.innerHTML = `
            <div class="controls-row">
                <button id="start-btn" class="control-btn">▶️ Iniciar</button>
                <button id="pause-btn" class="control-btn">⏸️ Pausar</button>
                <button id="reset-btn" class="control-btn">🔄 Reiniciar</button>
            </div>
            <div class="score-display">
                <span>Score: <span id="current-score">0</span></span>
                <span>Recorde: <span id="high-score">0</span></span>
                <span>FPS: <span id="fps-counter">0</span></span>
            </div>
            <div class="speed-controls">
                <label for="speed-slider">Velocidade:</label>
                <input type="range" id="speed-slider" min="50" max="200" value="100" class="speed-slider">
                <span id="speed-value">Normal</span>
            </div>
            <div class="instructions">
                <p>🎯 <strong>SETAS</strong> ou <strong>WASD</strong> para mover</p>
                <p>⏸️ <strong>ESPAÇO</strong> para pausar | <strong>R</strong> para reiniciar</p>
            </div>
        `;
        
        this.canvas.parentNode.insertBefore(controlsDiv, this.canvas.nextSibling);
        this.setupControlButtons();
        this.setupSpeedControl();
    }

    // 🎮 Configura botões de controle
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

    // 🎚️ ADICIONAMOS: Controle de velocidade
    setupSpeedControl() {
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            this.config.speed = 250 - speed; // Invertido: maior valor = mais lento
            
            // Atualiza texto descritivo
            if (speed < 80) speedValue.textContent = 'Lento';
            else if (speed < 120) speedValue.textContent = 'Normal';
            else if (speed < 160) speedValue.textContent = 'Rápido';
            else speedValue.textContent = 'Muito Rápido';
        });
    }

    // ⌨️ Configurar controles do teclado
    setupControls() {
        // 🎯 OTIMIZAÇÃO: Usamos keydown para resposta imediata
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        });
    }

    // ⌨️ Manipular pressionamento de teclas
    handleKeyPress(event) {
        // 🎯 OTIMIZAÇÃO: Resposta mais rápida às teclas
        let newDirection = null;
        
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction !== 'down') newDirection = 'up';
                break;
                
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction !== 'up') newDirection = 'down';
                break;
                
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction !== 'right') newDirection = 'left';
                break;
                
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction !== 'left') newDirection = 'right';
                break;
                
            case ' ': // Barra de espaço
                event.preventDefault();
                this.togglePause();
                break;
                
            case 'r':
            case 'R':
                event.preventDefault();
                this.reset();
                this.startSmoothGameLoop();
                break;
        }
        
        // 🎯 OTIMIZAÇÃO: Aplica a direção imediatamente se possível
        if (newDirection && this.gameState === 'running') {
            this.nextDirection = newDirection;
            
            // 🚀 MELHORIA: Movimento extra suave - permite mudança rápida de direção
            if (this.canChangeDirectionImmediately()) {
                this.direction = newDirection;
            }
        }
    }

    // 🎯 NOVO MÉTODO: Verifica se pode mudar direção imediatamente
    canChangeDirectionImmediately() {
        // Permite mudança mais responsiva
        return true;
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
        
        // 🎯 LIMPA buffers
        this.moveQueue = [];
        this.pendingMove = null;
        
        this.updateScoreDisplay();
        this.draw();
    }

    // 🍎 Gerar comida
    generateFood() {
        let newFood;
        let foodIsOnSnake;
        let attempts = 0;
        
        do {
            newFood = {
                x: Math.floor(Math.random() * (this.config.width / this.config.gridSize)),
                y: Math.floor(Math.random() * (this.config.height / this.config.gridSize))
            };
            
            foodIsOnSnake = this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
            
            attempts++;
            // 🎯 Prevenir loop infinito
            if (attempts > 100) break;
            
        } while (foodIsOnSnake);
        
        this.food = newFood;
    }

    // 🚀🎯 MÉTODO NOVO: Game Loop Moderno e Suave
    startSmoothGameLoop() {
        if (this.gameState === 'stopped' || this.gameState === 'gameover') {
            console.log('🚀 Iniciando Game Loop Suave...');
            this.gameState = 'running';
            this.lastUpdateTime = performance.now();
            
            // 🎯 GAME LOOP MODERNO: requestAnimationFrame + controle de tempo
            const gameLoop = (currentTime) => {
                if (this.gameState !== 'running') return;
                
                // 🎯 CALCULA DELTA TIME para movimento consistente
                this.deltaTime = currentTime - this.lastUpdateTime;
                
                // 🎯 ATUALIZAÇÃO: Baseada em tempo, não em frames fixos
                if (this.deltaTime >= this.config.speed) {
                    this.update();
                    this.lastUpdateTime = currentTime - (this.deltaTime % this.config.speed);
                }
                
                // 🎯 RENDERIZAÇÃO: Sempre na máxima frequência possível
                this.draw();
                
                // 🎯 ATUALIZA FPS
                this.updateFPSCounter();
                
                // 🎯 CONTINUA O LOOP
                this.gameLoop = requestAnimationFrame(gameLoop);
            };
            
            this.gameLoop = requestAnimationFrame(gameLoop);
        }
    }

    // 📊 NOVO MÉTODO: Contador de FPS
    updateFPSCounter() {
        const fpsElement = document.getElementById('fps-counter');
        if (fpsElement && this.deltaTime > 0) {
            const fps = Math.round(1000 / this.deltaTime);
            fpsElement.textContent = Math.min(fps, 60); // Limita a 60 para display
        }
    }

    // ⏸️ Pausar/Despausar
    togglePause() {
        if (this.gameState === 'running') {
            this.gameState = 'paused';
            if (this.gameLoop) {
                cancelAnimationFrame(this.gameLoop);
                this.gameLoop = null;
            }
            this.draw();
        } else if (this.gameState === 'paused') {
            this.startSmoothGameLoop();
        }
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
        // 🎯 MOVIMENTO MAIS SUAVE: Aplica a direção
        this.direction = this.nextDirection;
        this.moveSnake();
        this.checkCollisions();
    }

    // 🐍 Mover a cobrinha (OTIMIZADO)
    moveSnake() {
        const head = { ...this.snake[0] };
        
        switch(this.direction) {
            case 'up':    head.y--; break;
            case 'down':  head.y++; break;
            case 'left':  head.x--; break;
            case 'right': head.x++; break;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.updateScoreDisplay();
            
            // 🎯 FEEDBACK VISUAL ao comer
            this.createFoodParticles();
        } else {
            this.snake.pop();
        }
    }

    // 🎯 NOVO MÉTODO: Partículas para feedback visual
    createFoodParticles() {
        // Podemos adicionar efeitos visuais depois
        console.log('✨ Comida coletada!');
    }

    // 🚨 Verificar colisões
    checkCollisions() {
        const head = this.snake[0];
        
        // Colisão com paredes
        if (head.x < 0 || head.x >= this.config.width / this.config.gridSize ||
            head.y < 0 || head.y >= this.config.height / this.config.gridSize) {
            this.gameOver();
            return;
        }
        
        // Colisão com corpo
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

    // 🎨 Atualizar display de score
    updateScoreDisplay() {
        const currentScoreElement = document.getElementById('current-score');
        const highScoreElement = document.getElementById('high-score');
        
        if (currentScoreElement) currentScoreElement.textContent = this.score;
        if (highScoreElement) highScoreElement.textContent = this.highScore;
    }

    // 🎨 Desenhar o jogo (OTIMIZADO)
    draw() {
        this.clearCanvas();
        this.drawGrid();
        this.drawSnake();
        this.drawFood();
        this.drawUI();
        
        if (this.gameState === 'gameover') {
            this.drawGameOver();
        }
    }

    // 🧹 Limpar o canvas
    clearCanvas() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }

    // 🔲 Desenhar grade (MAIS SUAVE)
    drawGrid() {
        this.ctx.strokeStyle = '#2a2a2a';
        this.ctx.lineWidth = 0.5;
        
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

    // 🐍 Desenhar a cobrinha (MAIS BONITA)
    drawSnake() {
        this.snake.forEach((segment, index) => {
            // 🎯 GRADIENTE para a cobra - visual mais suave
            if (index === 0) {
                this.ctx.fillStyle = '#4CAF50'; // Cabeça - verde
            } else {
                // 🎯 CORPO com gradiente sutil
                const intensity = 1 - (index / this.snake.length) * 0.3;
                this.ctx.fillStyle = `rgb(139, 195, 74, ${intensity})`;
            }
            
            this.ctx.fillRect(
                segment.x * this.config.gridSize,
                segment.y * this.config.gridSize,
                this.config.gridSize - 1,
                this.config.gridSize - 1
            );
            
            // 🎯 DETALHES na cabeça
            if (index === 0) {
                this.drawSnakeEyes(segment);
            }
        });
    }

    // 👀 Desenhar olhos (MELHORADO)
    drawSnakeEyes(head) {
        this.ctx.fillStyle = '#000';
        const eyeSize = 3;
        const offset = 5;
        
        let leftEye, rightEye;
        
        switch(this.direction) {
            case 'right':
                leftEye = { x: head.x * this.config.gridSize + this.config.gridSize - offset, y: head.y * this.config.gridSize + offset };
                rightEye = { x: head.x * this.config.gridSize + this.config.gridSize - offset, y: head.y * this.config.gridSize + this.config.gridSize - offset };
                break;
            case 'left':
                leftEye = { x: head.x * this.config.gridSize + offset, y: head.y * this.config.gridSize + offset };
                rightEye = { x: head.x * this.config.gridSize + offset, y: head.y * this.config.gridSize + this.config.gridSize - offset };
                break;
            case 'up':
                leftEye = { x: head.x * this.config.gridSize + offset, y: head.y * this.config.gridSize + offset };
                rightEye = { x: head.x * this.config.gridSize + this.config.gridSize - offset, y: head.y * this.config.gridSize + offset };
                break;
            case 'down':
                leftEye = { x: head.x * this.config.gridSize + offset, y: head.y * this.config.gridSize + this.config.gridSize - offset };
                rightEye = { x: head.x * this.config.gridSize + this.config.gridSize - offset, y: head.y * this.config.gridSize + this.config.gridSize - offset };
                break;
        }
        
        this.ctx.fillRect(leftEye.x, leftEye.y, eyeSize, eyeSize);
        this.ctx.fillRect(rightEye.x, rightEye.y, eyeSize, eyeSize);
    }

    // 🍎 Desenhar a comida (MAIS BONITA)
    drawFood() {
        // 🎯 COMIDA com efeito visual
        this.ctx.fillStyle = '#FF5252';
        this.ctx.fillRect(
            this.food.x * this.config.gridSize,
            this.food.y * this.config.gridSize,
            this.config.gridSize - 1,
            this.config.gridSize - 1
        );
        
        // 🎯 BRILHO na comida
        this.ctx.fillStyle = '#FF8A80';
        this.ctx.fillRect(
            this.food.x * this.config.gridSize + 3,
            this.food.y * this.config.gridSize + 3,
            this.config.gridSize - 7,
            this.config.gridSize - 7
        );
    }

    // 📊 Desenhar interface
    drawUI() {
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.config.width, this.config.height);
            
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSADO', this.config.width / 2, this.config.height / 2);
            this.ctx.textAlign = 'left';
        }
    }

    // 💀 Game Over
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
        
        this.ctx.fillStyle = '#FF5252';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.config.width / 2, this.config.height / 2 - 30);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.config.width / 2, this.config.height / 2 + 10);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Pressione R para reiniciar', this.config.width / 2, this.config.height / 2 + 50);
        
        this.ctx.textAlign = 'left';
    }

    destroy() {
        this.stop();
    }
}