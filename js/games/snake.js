// 🐍 SNAKE GAME - Nosso primeiro jogo!

// 🎯 CONCEITO: Export default - Permite que este arquivo seja importado em outros
export default class SnakeGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Snake Classic";
        this.version = "1.0";
        
        // 🎯 CONCEITO: Configurações do jogo - Fácil ajuste
        this.config = {
            width: 400,    // Largura do canvas
            height: 400,   // Altura do canvas
            gridSize: 20,  // Tamanho de cada "bloco" do jogo
            speed: 150     // Velocidade do jogo (ms entre movimentos)
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

    // 🎯 CONCEITO: Método de inicialização assíncrona
    async init() {
        console.log('🎮 Inicializando Snake Game...');
        
        try {
            // 🎯 CONCEITO: Canvas Setup
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Configura o tamanho do canvas
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
            
            // 🎯 CONCEITO: Carregamento de recursos
            await this.loadResources();
            
            // Configura controles
            this.setupControls();
            
            // Inicializa o jogo (mas não inicia)
            this.reset();
            
            console.log('✅ Snake Game inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Snake:', error);
            throw error; // Repassa o erro para quem chamou
        }
    }

    // 📦 Carregar recursos (som, imagens, etc)
    async loadResources() {
        console.log('📦 Carregando recursos do Snake...');
        
        // 🎯 CONCEITO: Podemos carregar assets aqui
        // Por enquanto não temos, mas a estrutura está pronta
        
        return new Promise((resolve) => {
            // Simula um carregamento rápido
            setTimeout(resolve, 100);
        });
    }

    // 🎮 Configurar controles do jogo
    setupControls() {
        console.log('🎮 Configurando controles...');
        
        // 🎯 CONCEITO: Event Listener para teclado
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        });
        
        // 🎯 CONCEITO: Também podemos adicionar controles touch aqui depois
        this.setupTouchControls();
    }

    // ⌨️ Manipular pressionamento de teclas
    handleKeyPress(event) {
        // 🎯 CONCEITO: Switch statement para múltiplas condições
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
                this.togglePause();
                break;
                
            case 'r':
            case 'R':
                if (this.gameState === 'gameover') this.reset();
                break;
        }
        
        // 🎯 CONCEITO: Prevenir comportamento padrão das teclas
        if ([
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            ' ', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D', 'r', 'R'
        ].includes(event.key)) {
            event.preventDefault();
        }
    }

    // 📱 Configurar controles touch (para mobile)
    setupTouchControls() {
        console.log('📱 Configurando controles touch...');
        
        // 🎯 CONCEITO: Vamos implementar isso depois
        // Por enquanto é um placeholder
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
        
        // 🎮 Estado do jogo
        this.gameState = 'stopped';
        
        // 🎨 Desenha o estado inicial
        this.draw();
        
        console.log('✅ Jogo reiniciado!');
    }

    // 🍎 Gerar comida em posição aleatória
    generateFood() {
        console.log('🍎 Gerando nova comida...');
        
        let newFood;
        let foodIsOnSnake;
        
        // 🎯 CONCEITO: Do-While loop - execute pelo menos uma vez
        do {
            newFood = {
                x: Math.floor(Math.random() * (this.config.width / this.config.gridSize)),
                y: Math.floor(Math.random() * (this.config.height / this.config.gridSize))
            };
            
            // 🎯 CONCEITO: Array.some() - verifica se algum elemento satisfaz a condição
            foodIsOnSnake = this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
            
        } while (foodIsOnSnake); // Repete se a comida cair em cima da cobra
        
        this.food = newFood;
        console.log(`🍎 Comida gerada em: (${this.food.x}, ${this.food.y})`);
    }

    // ▶️ Iniciar o jogo
    start() {
        if (this.gameState === 'stopped' || this.gameState === 'gameover') {
            console.log('🎮 Iniciando jogo!');
            this.gameState = 'running';
            
            // 🎯 CONCEITO: Game Loop - o coração de todo jogo!
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
        console.log('⏹️ Parando jogo...');
        this.gameState = 'stopped';
        clearInterval(this.gameLoop);
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
        // 🎯 CONCEITO: Spread operator - copia o array
        const head = { ...this.snake[0] };
        
        // Move a cabeça baseado na direção
        switch(this.direction) {
            case 'up':    head.y--; break;
            case 'down':  head.y++; break;
            case 'left':  head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 🎯 CONCEITO: Array.unshift - adiciona no início do array
        this.snake.unshift(head);
        
        // 🍎 Verifica se comeu a comida
        if (head.x === this.food.x && head.y === this.food.y) {
            console.log('🐍 Comida comida! +10 pontos');
            this.score += 10;
            this.generateFood();
            
            // 🎯 CONCEITO: A cobra não diminui quando come = ela cresce!
        } else {
            // 🎯 CONCEITO: Array.pop - remove do final do array
            this.snake.pop();
        }
    }

    // 🚨 Verificar colisões
    checkCollisions() {
        const head = this.snake[0];
        
        // 1. Colisão com as paredes
        if (head.x < 0 || head.x >= this.config.width / this.config.gridSize ||
            head.y < 0 || head.y >= this.config.height / this.config.gridSize) {
            console.log('💥 Colisão com a parede!');
            this.gameOver();
            return;
        }
        
        // 2. Colisão com o próprio corpo
        // 🎯 CONCEITO: Array.slice - pega parte do array
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                console.log('💥 Colisão com o próprio corpo!');
                this.gameOver();
                return;
            }
        }
    }

    // 💀 Game Over
    gameOver() {
        console.log('💀 Game Over!');
        this.gameState = 'gameover';
        clearInterval(this.gameLoop);
        
        // 🏆 Atualiza high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            console.log(`🎉 Novo recorde: ${this.highScore}`);
        }
        
        // 💾 Salva a pontuação na plataforma
        if (window.gamePlatform) {
            window.gamePlatform.saveScore('Jogador', 'snake', this.score);
        }
    }

    // 🎨 Desenhar o jogo na tela
    draw() {
        // 🎯 CONCEITO: Limpar o canvas antes de redesenhar
        this.clearCanvas();
        
        // 🎨 Desenha a grade (opcional - para debug)
        this.drawGrid();
        
        // 🐍 Desenha a cobrinha
        this.drawSnake();
        
        // 🍎 Desenha a comida
        this.drawFood();
        
        // 📊 Desenha a UI (pontuação, etc)
        this.drawUI();
        
        // 🎮 Desenha tela de game over se necessário
        if (this.gameState === 'gameover') {
            this.drawGameOver();
        }
    }

    // 🧹 Limpar o canvas
    clearCanvas() {
        this.ctx.fillStyle = '#1a1a1a'; // Cinza escuro
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }

    // 🔲 Desenhar grade (para visualizar os grids)
    drawGrid() {
        this.ctx.strokeStyle = '#2a2a2a'; // Cinza mais claro
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
                // 🐍 Cabeça - cor diferente
                this.ctx.fillStyle = '#4CAF50'; // Verde
            } else {
                // 🐍 Corpo - cor normal
                this.ctx.fillStyle = '#8BC34A'; // Verde claro
            }
            
            this.ctx.fillRect(
                segment.x * this.config.gridSize,
                segment.y * this.config.gridSize,
                this.config.gridSize - 1, // -1 para dar espaçamento
                this.config.gridSize - 1
            );
            
            // 👀 Olhos na cabeça (opcional)
            if (index === 0) {
                this.drawSnakeEyes(segment);
            }
        });
    }

    // 👀 Desenhar olhos na cobrinha
    drawSnakeEyes(head) {
        this.ctx.fillStyle = '#000'; // Preto para os olhos
        
        const eyeSize = 3;
        const offset = 5;
        
        // Posições dos olhos baseadas na direção
        let leftEye = { x: 0, y: 0 };
        let rightEye = { x: 0, y: 0 };
        
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
        
        // Desenha os olhos
        this.ctx.fillRect(leftEye.x, leftEye.y, eyeSize, eyeSize);
        this.ctx.fillRect(rightEye.x, rightEye.y, eyeSize, eyeSize);
    }

    // 🍎 Desenhar a comida
    drawFood() {
        this.ctx.fillStyle = '#FF5252'; // Vermelho
        this.ctx.fillRect(
            this.food.x * this.config.gridSize,
            this.food.y * this.config.gridSize,
            this.config.gridSize - 1,
            this.config.gridSize - 1
        );
        
        // 🎯 CONCEITO: Detalhe na comida - um "brilho"
        this.ctx.fillStyle = '#FF8A80'; // Vermelho claro
        this.ctx.fillRect(
            this.food.x * this.config.gridSize + 3,
            this.food.y * this.config.gridSize + 3,
            this.config.gridSize - 7,
            this.config.gridSize - 7
        );
    }

    // 📊 Desenhar interface do usuário
    drawUI() {
        this.ctx.fillStyle = '#FFFFFF'; // Branco
        this.ctx.font = '16px Arial';
        
        // Pontuação atual
        this.ctx.fillText(`Score: ${this.score}`, 10, 20);
        
        // High score
        this.ctx.fillText(`High Score: ${this.highScore}`, 10, 40);
        
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

    // 🎯 CONCEITO: Destructor - limpeza quando o jogo for descartado
    destroy() {
        console.log('🧹 Limpando recursos do Snake...');
        this.stop();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
    }
}