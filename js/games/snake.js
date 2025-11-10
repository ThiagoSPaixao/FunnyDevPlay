// 🐍 SNAKE GAME - Versão Melhorada com Controles

export default class SnakeGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Snake Classic";
        this.version = "1.0";
        
        // 🎯 CONCEITO: Configurações do jogo
        this.config = {
            width: 400,
            height: 400,
            gridSize: 20,
            speed: 150
        };
        
        // 🎮 Estado do jogo
        this.gameState = 'stopped'; // stopped, running, paused, gameover
        this.score = 0;
        this.highScore = 0;
        
        // 🐍 Dados da cobrinha
        this.snake = [];
        this.direction = 'right';
        this.nextDirection = 'right';
        
        // 🍎 Dados da comida
        this.food = { x: 0, y: 0 };
        
        // 🔧 Referências técnicas
        this.canvas = null;
        this.ctx = null;
        this.gameLoop = null;
        
        console.log('🐍 Snake Game criado!');
    }

    async init() {
        console.log('🎮 Inicializando Snake Game...');
        
        try {
            // Configuração do canvas
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
            
            // 🎯 ADICIONAMOS: Cria os controles na tela
            this.createGameControls();
            
            // Configura controles de teclado
            this.setupControls();
            
            // Inicializa o jogo
            this.reset();
            
            // 🎯 ADICIONAMOS: Inicia automaticamente!
            this.start();
            
            console.log('✅ Snake Game inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Snake:', error);
            throw error;
        }
    }

    // 🎮 ADICIONAMOS ESTE MÉTODO: Cria controles visuais
    createGameControls() {
        console.log('🎮 Criando controles visuais...');
        
        // Encontra o container do jogo
        const gameContainer = document.getElementById('game-container');
        
        // 🎯 Cria div para os controles
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
            </div>
            <div class="instructions">
                <p>🎯 Use <strong>SETAS</strong> ou <strong>WASD</strong> para mover</p>
                <p>⏸️ <strong>ESPAÇO</strong> para pausar</p>
            </div>
        `;
        
        // Adiciona os controles DEPOIS do canvas
        this.canvas.parentNode.insertBefore(controlsDiv, this.canvas.nextSibling);
        
        // Configura os eventos dos botões
        this.setupControlButtons();
    }

    // 🎮 ADICIONAMOS ESTE MÉTODO: Configura botões de controle
    setupControlButtons() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.start();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
            this.start();
        });
    }

    // ⌨️ Configurar controles do teclado
    setupControls() {
        console.log('🎮 Configurando controles...');
        
        // 🎯 CONCEITO: Event Listener para teclado
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        });
    }

    // ⌨️ Manipular pressionamento de teclas
    handleKeyPress(event) {
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction !== 'down') this.nextDirection = 'up';
                break;
                
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction !== 'up') this.nextDirection = 'down';
                break;
                
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction !== 'right') this.nextDirection = 'left';
                break;
                
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction !== 'left') this.nextDirection = 'right';
                break;
                
            case ' ': // Barra de espaço
                event.preventDefault();
                this.togglePause();
                break;
                
            case 'r':
            case 'R':
                if (this.gameState === 'gameover') {
                    this.reset();
                    this.start();
                }
                break;
        }
    }

    // 🔄 Reiniciar o jogo
    reset() {
        console.log('🔄 Reiniciando jogo...');
        
        // Para o loop atual se estiver rodando
        this.stop();
        
        // 🐍 Inicializa a cobrinha no centro
        const startX = Math.floor(this.config.width / this.config.gridSize / 2);
        const startY = Math.floor(this.config.height / this.config.gridSize / 2);
        
        this.snake = [
            { x: startX, y: startY },     // Cabeça
            { x: startX - 1, y: startY }, // Corpo
            { x: startX - 2, y: startY }  // Mais corpo
        ];
        
        // 🔄 Reset de direções
        this.direction = 'right';
        this.nextDirection = 'right';
        
        // 🍎 Gera a primeira comida
        this.generateFood();
        
        // 🏆 Reset de scores
        this.score = 0;
        this.updateScoreDisplay();
        
        // 🎮 Estado do jogo
        this.gameState = 'stopped';
        
        // 🎨 Desenha o estado inicial
        this.draw();
        
        console.log('✅ Jogo reiniciado!');
    }

    // 🍎 Gerar comida em posição aleatória
    generateFood() {
        let newFood;
        let foodIsOnSnake;
        
        do {
            newFood = {
                x: Math.floor(Math.random() * (this.config.width / this.config.gridSize)),
                y: Math.floor(Math.random() * (this.config.height / this.config.gridSize))
            };
            
            foodIsOnSnake = this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
            
        } while (foodIsOnSnake);
        
        this.food = newFood;
    }

    // ▶️ Iniciar o jogo
    start() {
        if (this.gameState === 'stopped' || this.gameState === 'gameover') {
            console.log('🎮 Iniciando jogo!');
            this.gameState = 'running';
            
            // 🎯 Game Loop - o coração do jogo!
            this.gameLoop = setInterval(() => {
                this.update();
                this.draw();
            }, this.config.speed);
        }
    }

    // ⏸️ Pausar/Despausar o jogo
    togglePause() {
        if (this.gameState === 'running') {
            console.log('⏸️ Jogo pausado');
            this.gameState = 'paused';
            clearInterval(this.gameLoop);
            this.draw(); // Redesenha para mostrar "PAUSADO"
        } else if (this.gameState === 'paused') {
            console.log('▶️ Jogo despausado');
            this.gameState = 'running';
            this.gameLoop = setInterval(() => {
                this.update();
                this.draw();
            }, this.config.speed);
        }
    }

    // ⏹️ Parar o jogo completamente
    stop() {
        this.gameState = 'stopped';
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    // 🔄 Atualizar a lógica do jogo
    update() {
        // Atualiza a direção atual
        this.direction = this.nextDirection;
        
        // 🐍 Move a cobrinha
        this.moveSnake();
        
        // 🎯 Verifica colisões
        this.checkCollisions();
    }

    // 🐍 Mover a cobrinha
    moveSnake() {
        const head = { ...this.snake[0] };
        
        // Move a cabeça baseado na direção
        switch(this.direction) {
            case 'up':    head.y--; break;
            case 'down':  head.y++; break;
            case 'left':  head.x--; break;
            case 'right': head.x++; break;
        }
        
        this.snake.unshift(head);
        
        // 🍎 Verifica se comeu a comida
        if (head.x === this.food.x && head.y === this.food.y) {
            console.log('🐍 Comida comida! +10 pontos');
            this.score += 10;
            this.generateFood();
            this.updateScoreDisplay();
        } else {
            this.snake.pop();
        }
    }

    // 🚨 Verificar colisões
    checkCollisions() {
        const head = this.snake[0];
        
        // 1. Colisão com as paredes
        if (head.x < 0 || head.x >= this.config.width / this.config.gridSize ||
            head.y < 0 || head.y >= this.config.height / this.config.gridSize) {
            this.gameOver();
            return;
        }
        
        // 2. Colisão com o próprio corpo
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }
    }

    // 💀 Game Over
    gameOver() {
        console.log('💀 Game Over!');
        this.gameState = 'gameover';
        this.stop();
        
        // 🏆 Atualiza high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.updateScoreDisplay();
        }
        
        // 💾 Salva a pontuação na plataforma
        if (window.gamePlatform) {
            window.gamePlatform.saveScore('Jogador', 'snake', this.score);
        }
    }

    // 🎨 ADICIONAMOS: Atualizar display de score
    updateScoreDisplay() {
        const currentScoreElement = document.getElementById('current-score');
        const highScoreElement = document.getElementById('high-score');
        
        if (currentScoreElement) {
            currentScoreElement.textContent = this.score;
        }
        if (highScoreElement) {
            highScoreElement.textContent = this.highScore;
        }
    }

    // 🎨 Desenhar o jogo na tela
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

    // 🔲 Desenhar grade
    drawGrid() {
        this.ctx.strokeStyle = '#2a2a2a';
        this.ctx.lineWidth = 0.5;
        
        // Linhas verticais
        for (let x = 0; x <= this.config.width; x += this.config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.config.height);
            this.ctx.stroke();
        }
        
        // Linhas horizontais
        for (let y = 0; y <= this.config.height; y += this.config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.config.width, y);
            this.ctx.stroke();
        }
    }

    // 🐍 Desenhar a cobrinha
    drawSnake() {
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // 🐍 Cabeça
                this.ctx.fillStyle = '#4CAF50';
            } else {
                // 🐍 Corpo
                this.ctx.fillStyle = '#8BC34A';
            }
            
            this.ctx.fillRect(
                segment.x * this.config.gridSize,
                segment.y * this.config.gridSize,
                this.config.gridSize - 1,
                this.config.gridSize - 1
            );
        });
    }

    // 🍎 Desenhar a comida
    drawFood() {
        this.ctx.fillStyle = '#FF5252';
        this.ctx.fillRect(
            this.food.x * this.config.gridSize,
            this.food.y * this.config.gridSize,
            this.config.gridSize - 1,
            this.config.gridSize - 1
        );
    }

    // 📊 Desenhar interface do usuário
    drawUI() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        
        // Estado do jogo
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

    // 💀 Desenhar tela de Game Over
    drawGameOver() {
        // Fundo semi-transparente
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
        
        // Texto de Game Over
        this.ctx.fillStyle = '#FF5252';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.config.width / 2, this.config.height / 2 - 30);
        
        // Pontuação final
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.config.width / 2, this.config.height / 2 + 10);
        
        // Instruções
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Pressione R para reiniciar', this.config.width / 2, this.config.height / 2 + 50);
        
        this.ctx.textAlign = 'left';
    }

    destroy() {
        console.log('🧹 Limpando recursos do Snake...');
        this.stop();
    }
}