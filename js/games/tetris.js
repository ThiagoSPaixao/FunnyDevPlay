// 🧩 TETRIS PREMIUM - VERSÃO COMPLETA E CORRIGIDA

export default class TetrisGame {
    constructor() {
        // 🏷️ Identificação do jogo
        this.name = "Tetris Premium";
        this.version = "2.0";
        
        // 🎯 CONFIGURAÇÕES AVANÇADAS
        this.config = {
            width: 300,
            height: 600,
            gridSize: 30,
            previewSize: 20,
            initialSpeed: 1000,
            minSpeed: 50,
            levelSpeedReduction: 50
        };
        
        // 🎮 Estado do jogo
        this.gameState = 'stopped'; // stopped, running, paused, gameover
        this.score = 0;
        this.highScore = localStorage.getItem('tetrisHighScore') || 0;
        this.level = 1;
        this.linesCleared = 0;
        this.combo = 0;
        
        // 🧩 Dados do jogo
        this.grid = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.ghostPiece = null;
        
        // ⏰ Timing e controle
        this.lastDropTime = 0;
        this.dropInterval = this.config.initialSpeed;
        this.gameLoop = null;
        
        // ✨ Efeitos visuais
        this.particles = [];
        this.animations = [];
        
        // 🎨 Definição das peças (cores e formatos)
        this.pieces = {
            I: {
                shape: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                color: '#00BCD4', // Cyan
                previewColor: 'rgba(0, 188, 212, 0.3)'
            },
            O: {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#FFD700', // Yellow
                previewColor: 'rgba(255, 215, 0, 0.3)'
            },
            T: {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#9C27B0', // Purple
                previewColor: 'rgba(156, 39, 176, 0.3)'
            },
            L: {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#FF9800', // Orange
                previewColor: 'rgba(255, 152, 0, 0.3)'
            },
            J: {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#2196F3', // Blue
                previewColor: 'rgba(33, 150, 243, 0.3)'
            },
            S: {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0]
                ],
                color: '#4CAF50', // Green
                previewColor: 'rgba(76, 175, 80, 0.3)'
            },
            Z: {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                ],
                color: '#f44336', // Red
                previewColor: 'rgba(244, 67, 54, 0.3)'
            }
        };
        
        // 🎯 Sistema de pontuação oficial do Tetris
        this.scoring = {
            single: 100,
            double: 300,
            triple: 500,
            tetris: 800,
            tSpinMini: 100,
            tSpin: 400,
            tSpinMiniSingle: 200,
            tSpinSingle: 800,
            tSpinDouble: 1200,
            tSpinTriple: 1600,
            backToBackBonus: 1.5,
            combo: 50,
            perfectClear: 2000,
            softDrop: 1,
            hardDrop: 2
        };
        
        // 🔧 Referências técnicas
        this.canvas = null;
        this.ctx = null;
        this.previewCanvas = null;
        this.previewCtx = null;
        this.holdCanvas = null;
        this.holdCtx = null;
        
        console.log('🧩 Tetris Premium criado!');
    }

    async init() {
        console.log('🎮 Inicializando Tetris Premium...');
        
        try {
            // Verifica se o container existe
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                throw new Error('Container do jogo não encontrado!');
            }
            
            // Configuração dos canvases
            this.canvas = document.getElementById('game-canvas');
            if (!this.canvas) {
                throw new Error('Canvas do jogo não encontrado!');
            }
            
            this.ctx = this.canvas.getContext('2d');
            
            this.canvas.width = this.config.width;
            this.canvas.height = this.config.height;
            
            // Cria a interface do jogo
            this.createGameInterface();
            
            // Configura controles
            this.setupControls();
            
            // Inicializa o jogo
            this.reset();
            
            console.log('✅ Tetris Premium inicializado!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Tetris:', error);
            throw error;
        }
    }

    // 🎨 CRIAR INTERFACE DO JOGO
    createGameInterface() {
        const gameContainer = document.getElementById('game-container');
        
        // 🔧 CORREÇÃO: Limpa container antes de adicionar
        gameContainer.innerHTML = '';
        
        const gameHTML = `
            <div class="tetris-game">
                <div class="tetris-header">
                    <h2 id="game-title">🧩 Tetris Premium</h2>
                </div>

                <div class="tetris-stats">
                    <div class="stat-item">
                        <span class="stat-label">Score</span>
                        <span id="tetris-score" class="stat-value">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Level</span>
                        <span id="tetris-level" class="stat-value">1</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Lines</span>
                        <span id="tetris-lines" class="stat-value">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Recorde</span>
                        <span id="tetris-highscore" class="stat-value">${this.highScore}</span>
                    </div>
                </div>

                <div class="tetris-container">
                    <div class="side-panels">
                        <div class="hold-panel">
                            <div class="panel-title">Hold</div>
                            <canvas id="hold-canvas" class="hold-canvas" width="80" height="80"></canvas>
                        </div>
                        
                        <div class="preview-panel">
                            <div class="panel-title">Next</div>
                            <canvas id="preview-canvas" class="preview-canvas" width="80" height="80"></canvas>
                        </div>
                    </div>

                    <div class="game-area">
                        <div class="tetris-grid">
                            <canvas id="game-canvas"></canvas>
                            <div id="pause-overlay" class="pause-overlay" style="display: none;">
                                <div class="pause-content">
                                    <div class="pause-title">⏸️ PAUSED</div>
                                    <div class="pause-subtitle">Press SPACE to continue</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tetris-controls">
                    <div class="control-buttons">
                        <button id="tetris-start" class="tetris-btn">▶️ Iniciar</button>
                        <button id="tetris-pause" class="tetris-btn">⏸️ Pausar</button>
                        <button id="tetris-reset" class="tetris-btn">🔄 Reiniciar</button>
                        <button id="tetris-hold" class="tetris-btn secondary">📥 Hold</button>
                        <button id="tetris-hard-drop" class="tetris-btn warning">⬇️ Hard Drop</button>
                        <button id="tetris-controls-help" class="tetris-btn">🎮 Controles</button>
                    </div>
                </div>
            </div>

            <!-- Controles Touch para Mobile -->
            <div class="touch-controls" style="display: none;">
                <div class="touch-section">
                    <div class="touch-row">
                        <button class="touch-btn rotate">↻</button>
                    </div>
                    <div class="touch-row">
                        <button class="touch-btn hold">📥</button>
                    </div>
                </div>
                
                <div class="touch-section">
                    <div class="touch-row">
                        <button class="touch-btn left">⬅️</button>
                        <button class="touch-btn drop">⬇️</button>
                        <button class="touch-btn right">➡️</button>
                    </div>
                </div>
            </div>
        `;
        
        gameContainer.insertAdjacentHTML('beforeend', gameHTML);
        
        // 🔧 CORREÇÃO: Reconfigura referências após criar a interface
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        
        this.previewCanvas = document.getElementById('preview-canvas');
        this.previewCtx = this.previewCanvas.getContext('2d');
        
        this.holdCanvas = document.getElementById('hold-canvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        
        this.setupGameControls();
    }

    // 🎮 CONFIGURAR CONTROLES DO JOGO
    setupGameControls() {
        // 🔧 CORREÇÃO: Verifica se elementos existem antes de adicionar eventos
        const startBtn = document.getElementById('tetris-start');
        const pauseBtn = document.getElementById('tetris-pause');
        const resetBtn = document.getElementById('tetris-reset');
        const holdBtn = document.getElementById('tetris-hold');
        const hardDropBtn = document.getElementById('tetris-hard-drop');
        const controlsHelpBtn = document.getElementById('tetris-controls-help');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startGame());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.togglePause());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (holdBtn) holdBtn.addEventListener('click', () => this.holdPiece());
        if (hardDropBtn) hardDropBtn.addEventListener('click', () => this.hardDrop());
        if (controlsHelpBtn) controlsHelpBtn.addEventListener('click', () => this.showControlsHelp());
        
        // Configura controles touch
        this.setupTouchControls();
    }

    // 📱 CONFIGURAR CONTROLES TOUCH
    setupTouchControls() {
        if (!this.isMobileDevice()) return;
        
        // Mostra controles touch apenas em dispositivos móveis
        const touchControls = document.querySelector('.touch-controls');
        if (touchControls) {
            touchControls.style.display = 'flex';
        }
        
        // 🔧 CORREÇÃO: Seletores mais específicos para evitar conflitos
        const leftBtn = document.querySelector('.touch-btn.left');
        const rightBtn = document.querySelector('.touch-btn.right');
        const dropBtn = document.querySelector('.touch-btn.drop');
        const rotateBtn = document.querySelector('.touch-btn.rotate');
        const holdBtn = document.querySelector('.touch-btn.hold');
        
        // Controles de movimento
        if (leftBtn) {
            leftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.moveLeft();
            });
        }
        
        if (dropBtn) {
            dropBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.softDrop();
            });
        }
        
        if (rightBtn) {
            rightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.moveRight();
            });
        }
        
        // Controles especiais
        if (rotateBtn) {
            rotateBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.rotatePiece();
            });
        }
        
        if (holdBtn) {
            holdBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.holdPiece();
            });
        }
    }

    // 🎮 CONFIGURAR CONTROLES DE TECLADO
    setupControls() {
        document.addEventListener('keydown', (e) => {
            // 🔧 CORREÇÃO: Permite espaço para iniciar/pausar em qualquer estado
            if (e.key === ' ' && this.gameState !== 'running') {
                e.preventDefault();
                this.togglePause();
                return;
            }
            
            if (this.gameState !== 'running') return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.moveLeft();
                    break;
                    
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.moveRight();
                    break;
                    
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.softDrop();
                    break;
                    
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.rotatePiece();
                    break;
                    
                case ' ':
                    e.preventDefault();
                    this.hardDrop();
                    break;
                    
                case 'c':
                case 'C':
                case 'Shift':
                    e.preventDefault();
                    this.holdPiece();
                    break;
                    
                case 'p':
                case 'P':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
    }

    // 📱 DETECTAR DISPOSITIVO MOBILE
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.innerWidth <= 768 && window.innerHeight <= 1024);
    }

    // 🔄 REINICIAR JOGO
    reset() {
        this.stopGame();
        
        // Reinicia estado do jogo
        this.grid = this.createEmptyGrid();
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.combo = 0;
        this.dropInterval = this.config.initialSpeed;
        this.canHold = true;
        this.holdPiece = null;
        this.ghostPiece = null;
        
        // Gera peças iniciais
        this.currentPiece = this.createRandomPiece();
        this.nextPiece = this.createRandomPiece();
        this.updateGhostPiece();
        
        // Atualiza interface
        this.updateGameDisplay();
        this.draw();
        this.drawPreview();
        this.drawHold();
        
        // 🔧 CORREÇÃO: Esconde overlay de pausa
        const pauseOverlay = document.getElementById('pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.style.display = 'none';
        }
        
        console.log('🔄 Tetris reiniciado!');
    }

    // 🎮 INICIAR JOGO
    startGame() {
        if (this.gameState === 'running') return;
        
        this.gameState = 'running';
        this.lastDropTime = performance.now();
        this.startGameLoop();
        
        // 🔧 CORREÇÃO: Esconde overlay de pausa ao iniciar
        const pauseOverlay = document.getElementById('pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.style.display = 'none';
        }
        
        console.log('🎮 Tetris iniciado!');
    }

    // 🎯 INICIAR GAME LOOP
    startGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        const gameLoop = (currentTime) => {
            if (this.gameState !== 'running') return;
            
            // Atualiza queda da peça
            if (currentTime - this.lastDropTime > this.dropInterval) {
                this.dropPiece();
                this.lastDropTime = currentTime;
            }
            
            // Atualiza animações
            this.updateAnimations();
            
            // Desenha o jogo
            this.draw();
            
            this.gameLoop = requestAnimationFrame(gameLoop);
        };
        
        this.gameLoop = requestAnimationFrame(gameLoop);
    }

    // ⏸️ PAUSAR/DESPAUSAR
    togglePause() {
        if (this.gameState === 'running') {
            this.gameState = 'paused';
            const pauseOverlay = document.getElementById('pause-overlay');
            if (pauseOverlay) {
                pauseOverlay.style.display = 'flex';
            }
        } else if (this.gameState === 'paused') {
            this.gameState = 'running';
            const pauseOverlay = document.getElementById('pause-overlay');
            if (pauseOverlay) {
                pauseOverlay.style.display = 'none';
            }
            this.lastDropTime = performance.now();
            this.startGameLoop();
        } else if (this.gameState === 'stopped') {
            // Se estiver parado, inicia o jogo
            this.startGame();
        }
    }

    // ⏹️ PARAR JOGO
    stopGame() {
        this.gameState = 'stopped';
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    // 🧩 CRIAR GRADE VAZIA
    createEmptyGrid() {
        const rows = this.config.height / this.config.gridSize;
        const cols = this.config.width / this.config.gridSize;
        return Array(rows).fill().map(() => Array(cols).fill(0));
    }

    // 🎰 CRIAR PEÇA ALEATÓRIA
    createRandomPiece() {
        const pieces = Object.keys(this.pieces);
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        return {
            type: randomPiece,
            shape: JSON.parse(JSON.stringify(this.pieces[randomPiece].shape)), // 🔧 CORREÇÃO: Deep copy
            color: this.pieces[randomPiece].color,
            x: Math.floor((this.grid[0].length - this.pieces[randomPiece].shape[0].length) / 2),
            y: 0,
            rotation: 0
        };
    }

    // 👻 ATUALIZAR PEÇA FANTASMA
    updateGhostPiece() {
        if (!this.currentPiece) return;
        
        this.ghostPiece = {
            ...this.currentPiece,
            shape: JSON.parse(JSON.stringify(this.currentPiece.shape)),
            y: this.currentPiece.y
        };
        
        // Move a peça fantasma para a posição mais baixa possível
        while (!this.checkCollision(this.ghostPiece.x, this.ghostPiece.y + 1, this.ghostPiece.shape)) {
            this.ghostPiece.y++;
        }
    }

    // 🧩 MOVER PEÇA PARA ESQUERDA
    moveLeft() {
        if (this.gameState !== 'running') return;
        
        if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x--;
            this.updateGhostPiece();
            this.draw();
        }
    }

    // 🧩 MOVER PEÇA PARA DIREITA
    moveRight() {
        if (this.gameState !== 'running') return;
        
        if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x++;
            this.updateGhostPiece();
            this.draw();
        }
    }

    // ⬇️ QUEDA SUAVE (Soft Drop)
    softDrop() {
        if (this.gameState !== 'running') return;
        
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
            this.score += this.scoring.softDrop;
            this.updateGameDisplay();
            this.updateGhostPiece();
            this.draw();
        } else {
            this.lockPiece();
        }
    }

    // ⬇️⬇️ QUEDA RÁPIDA (Hard Drop)
    hardDrop() {
        if (this.gameState !== 'running') return;
        
        let dropDistance = 0;
        const originalY = this.currentPiece.y;
        
        while (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
            dropDistance++;
        }
        
        this.score += dropDistance * this.scoring.hardDrop;
        this.lockPiece();
    }

    // 🔄 ROTACIONAR PEÇA
    rotatePiece() {
        if (this.gameState !== 'running') return;
        
        const newShape = this.rotateMatrix(this.currentPiece.shape);
        
        // Tenta rotacionar, se colidir tenta wall kicks
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, newShape)) {
            this.currentPiece.shape = newShape;
        } else {
            // Wall kick para direita
            if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, newShape)) {
                this.currentPiece.x++;
                this.currentPiece.shape = newShape;
            }
            // Wall kick para esquerda
            else if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, newShape)) {
                this.currentPiece.x--;
                this.currentPiece.shape = newShape;
            }
            // Wall kick para cima (apenas se necessário)
            else if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y - 1, newShape)) {
                this.currentPiece.y--;
                this.currentPiece.shape = newShape;
            }
            // Se nenhum wall kick funcionar, não rotaciona
            else {
                return;
            }
        }
        
        this.updateGhostPiece();
        this.draw();
    }

    // 📥 GUARDAR PEÇA (Hold)
    holdPiece() {
        if (this.gameState !== 'running' || !this.canHold) return;
        
        // 🔧 CORREÇÃO: Verifica se currentPiece existe
        if (!this.currentPiece) return;
        
        if (this.holdPiece) {
            // Troca a peça atual com a peça guardada
            const temp = this.currentPiece;
            this.currentPiece = {
                ...this.holdPiece,
                x: Math.floor((this.grid[0].length - this.holdPiece.shape[0].length) / 2),
                y: 0,
                shape: JSON.parse(JSON.stringify(this.holdPiece.shape))
            };
            this.holdPiece = {
                ...temp,
                x: 0,
                y: 0
            };
        } else {
            // Guarda a peça atual e pega uma nova
            this.holdPiece = {
                ...this.currentPiece,
                x: 0,
                y: 0
            };
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.createRandomPiece();
        }
        
        this.canHold = false;
        this.updateGhostPiece();
        this.drawHold();
        this.drawPreview();
        this.draw();
        
        // 🔧 CORREÇÃO: Verifica colisão imediata após hold (game over)
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver();
        }
    }

    // ⬇️ QUEDA AUTOMÁTICA DA PEÇA
    dropPiece() {
        if (this.gameState !== 'running') return;
        
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
            this.updateGhostPiece();
        } else {
            this.lockPiece();
        }
    }

    // 🔒 TRAVAR PEÇA NA GRADE
    lockPiece() {
        // 🔧 CORREÇÃO: Verifica se currentPiece existe
        if (!this.currentPiece) return;
        
        // Adiciona a peça atual à grade
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const gridY = this.currentPiece.y + y;
                    const gridX = this.currentPiece.x + x;
                    
                    if (gridY >= 0 && gridY < this.grid.length && gridX >= 0 && gridX < this.grid[0].length) {
                        this.grid[gridY][gridX] = {
                            color: this.currentPiece.color,
                            type: this.currentPiece.type
                        };
                    }
                }
            }
        }
        
        // Verifica e limpa linhas completas
        const linesCleared = this.clearLines();
        
        // Cria nova peça
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createRandomPiece();
        this.canHold = true;
        
        // Verifica game over
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver();
            return;
        }
        
        this.updateGhostPiece();
        this.drawPreview();
        this.draw();
    }

    // 🧹 LIMPAR LINHAS COMPLETAS
    clearLines() {
        let linesCleared = 0;
        let linesToClear = [];
        
        // Encontra linhas completas
        for (let y = this.grid.length - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                linesToClear.push(y);
                linesCleared++;
            }
        }
        
        if (linesCleared > 0) {
            // Anima a limpeza das linhas
            this.animateLineClear(linesToClear);
            
            // Remove as linhas completas
            linesToClear.sort((a, b) => a - b).forEach(lineY => {
                this.grid.splice(lineY, 1);
                this.grid.unshift(Array(this.grid[0].length).fill(0));
            });
            
            // Atualiza estatísticas
            this.linesCleared += linesCleared;
            this.updateLevel();
            this.calculateScore(linesCleared);
            
            // Cria efeitos de partículas
            this.createLineClearParticles(linesToClear);
        }
        
        return linesCleared;
    }

    // ✨ ANIMAR LIMPEZA DE LINHAS
    animateLineClear(lines) {
        lines.forEach(lineY => {
            this.animations.push({
                type: 'lineClear',
                y: lineY * this.config.gridSize,
                progress: 0,
                duration: 0.3
            });
        });
    }

    // ✨ CRIAR PARTÍCULAS PARA LINHAS LIMPAS
    createLineClearParticles(lines) {
        lines.forEach(lineY => {
            for (let x = 0; x < this.grid[0].length; x++) {
                const cell = this.grid[lineY]?.[x];
                if (cell) {
                    for (let i = 0; i < 3; i++) {
                        this.particles.push({
                            x: x * this.config.gridSize + this.config.gridSize / 2,
                            y: lineY * this.config.gridSize + this.config.gridSize / 2,
                            vx: (Math.random() - 0.5) * 8,
                            vy: (Math.random() - 0.5) * 8,
                            life: 60,
                            color: cell.color || '#FFFFFF',
                            size: Math.random() * 3 + 1
                        });
                    }
                }
            }
        });
    }

    // 📊 ATUALIZAR NÍVEL
    updateLevel() {
        const newLevel = Math.floor(this.linesCleared / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = Math.max(
                this.config.minSpeed,
                this.config.initialSpeed - (this.level - 1) * this.config.levelSpeedReduction
            );
            
            // Efeito visual de level up
            const levelElement = document.getElementById('tetris-level');
            if (levelElement) {
                levelElement.classList.add('level-up');
                setTimeout(() => {
                    levelElement.classList.remove('level-up');
                }, 500);
            }
        }
    }

    // 🧮 CALCULAR PONTUAÇÃO
    calculateScore(linesCleared) {
        let points = 0;
        
        switch(linesCleared) {
            case 1:
                points = this.scoring.single;
                break;
            case 2:
                points = this.scoring.double;
                break;
            case 3:
                points = this.scoring.triple;
                break;
            case 4:
                points = this.scoring.tetris;
                // Bonus back-to-back Tetris
                if (this.combo > 0 && this.combo % 4 === 0) {
                    points *= this.scoring.backToBackBonus;
                }
                break;
        }
        
        // Multiplica pelo nível
        points *= this.level;
        
        // Adiciona bônus de combo
        if (linesCleared > 0) {
            this.combo++;
            points += this.combo * this.scoring.combo;
        } else {
            this.combo = 0;
        }
        
        this.score += Math.floor(points);
        this.updateGameDisplay();
    }

    // 🚨 VERIFICAR COLISÃO
    checkCollision(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    // Verifica limites da grade
                    if (newX < 0 || newX >= this.grid[0].length || newY >= this.grid.length) {
                        return true;
                    }
                    
                    // Verifica se saiu do topo (permite rotação no spawn)
                    if (newY < 0) continue;
                    
                    // Verifica colisão com outras peças
                    if (this.grid[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // 🔄 ROTACIONAR MATRIZ
    rotateMatrix(matrix) {
        const N = matrix.length;
        const result = Array(N).fill().map(() => Array(N).fill(0));
        
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                result[x][N - 1 - y] = matrix[y][x];
            }
        }
        return result;
    }

    // ✨ ATUALIZAR ANIMAÇÕES
    updateAnimations() {
        // Atualiza animações
        this.animations = this.animations.filter(anim => {
            anim.progress += 0.016 / anim.duration;
            return anim.progress < 1;
        });
        
        // Atualiza partículas
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravidade
            particle.life--;
            return particle.life > 0;
        });
    }

    // 🖼️ DESENHAR JOGO
    draw() {
        if (!this.ctx) return;
        
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        
        // Desenha o grid de fundo
        this.drawGrid();
        
        // Desenha as peças travadas
        this.drawLockedPieces();
        
        // Desenha a peça fantasma
        this.drawGhostPiece();
        
        // Desenha a peça atual
        this.drawCurrentPiece();
        
        // Desenha animações
        this.drawAnimations();
        
        // Desenha partículas
        this.drawParticles();
    }

    // 🔲 DESENHAR GRADE DE FUNDO
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
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

    // 🧩 DESENHAR PEÇAS TRAVADAS
    drawLockedPieces() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] !== 0) {
                    this.drawBlock(
                        x * this.config.gridSize,
                        y * this.config.gridSize,
                        this.grid[y][x].color
                    );
                }
            }
        }
    }

    // 👻 DESENHAR PEÇA FANTASMA
    drawGhostPiece() {
        if (!this.ghostPiece) return;
        
        this.ctx.globalAlpha = 0.3;
        for (let y = 0; y < this.ghostPiece.shape.length; y++) {
            for (let x = 0; x < this.ghostPiece.shape[y].length; x++) {
                if (this.ghostPiece.shape[y][x]) {
                    this.drawBlock(
                        (this.ghostPiece.x + x) * this.config.gridSize,
                        (this.ghostPiece.y + y) * this.config.gridSize,
                        this.ghostPiece.color,
                        true // É fantasma
                    );
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    // 🧩 DESENHAR PEÇA ATUAL
    drawCurrentPiece() {
        if (!this.currentPiece) return;
        
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    this.drawBlock(
                        (this.currentPiece.x + x) * this.config.gridSize,
                        (this.currentPiece.y + y) * this.config.gridSize,
                        this.currentPiece.color
                    );
                }
            }
        }
    }

    // 🧱 DESENHAR BLOCO INDIVIDUAL
    drawBlock(x, y, color, isGhost = false) {
        const size = this.config.gridSize;
        const padding = 2;
        
        if (isGhost) {
            // Bloco fantasma (transparente)
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + padding, y + padding, size - padding * 2, size - padding * 2);
        } else {
            // Bloco sólido com gradiente
            const gradient = this.ctx.createLinearGradient(x, y, x + size, y + size);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, this.darkenColor(color, 0.3));
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x + padding, y + padding, size - padding * 2, size - padding * 2);
            
            // Borda interna
            this.ctx.strokeStyle = this.lightenColor(color, 0.3);
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x + padding, y + padding, size - padding * 2, size - padding * 2);
        }
    }

    // ✨ DESENHAR ANIMAÇÕES
    drawAnimations() {
        this.animations.forEach(anim => {
            if (anim.type === 'lineClear') {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * (1 - anim.progress)})`;
                this.ctx.fillRect(0, anim.y, this.config.width, this.config.gridSize);
            }
        });
    }

    // ✨ DESENHAR PARTÍCULAS
    drawParticles() {
        this.particles.forEach(particle => {
            const progress = particle.life / 60;
            const alpha = Math.max(0, progress);
            const size = particle.size * progress;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    // 👁️ DESENHAR PREVIEW
    drawPreview() {
        if (!this.nextPiece || !this.previewCtx) return;
        
        this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        
        const piece = this.pieces[this.nextPiece.type];
        const blockSize = this.config.previewSize;
        const offsetX = (this.previewCanvas.width - piece.shape[0].length * blockSize) / 2;
        const offsetY = (this.previewCanvas.height - piece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.previewCtx.fillStyle = piece.previewColor;
                    this.previewCtx.fillRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                    
                    this.previewCtx.strokeStyle = piece.color;
                    this.previewCtx.lineWidth = 1;
                    this.previewCtx.strokeRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            }
        }
    }

    // 📥 DESENHAR PEÇA GUARDADA
    drawHold() {
        if (!this.holdCtx) return;
        
        this.holdCtx.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
        
        if (!this.holdPiece) return;
        
        const piece = this.pieces[this.holdPiece.type];
        const blockSize = this.config.previewSize;
        const offsetX = (this.holdCanvas.width - piece.shape[0].length * blockSize) / 2;
        const offsetY = (this.holdCanvas.height - piece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.holdCtx.fillStyle = piece.previewColor;
                    this.holdCtx.fillRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                    
                    this.holdCtx.strokeStyle = piece.color;
                    this.holdCtx.lineWidth = 1;
                    this.holdCtx.strokeRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            }
        }
    }

    // 📊 ATUALIZAR DISPLAY DO JOGO
    updateGameDisplay() {
        const scoreElement = document.getElementById('tetris-score');
        const levelElement = document.getElementById('tetris-level');
        const linesElement = document.getElementById('tetris-lines');
        const highscoreElement = document.getElementById('tetris-highscore');
        
        if (scoreElement) scoreElement.textContent = this.score.toLocaleString();
        if (levelElement) levelElement.textContent = this.level;
        if (linesElement) linesElement.textContent = this.linesCleared;
        if (highscoreElement) highscoreElement.textContent = this.highScore.toLocaleString();
        
        // Efeito de combo
        if (this.combo > 0 && scoreElement) {
            scoreElement.classList.add('combo-active');
            setTimeout(() => {
                scoreElement.classList.remove('combo-active');
            }, 300);
        }
    }

    // 💀 GAME OVER
    gameOver() {
        this.gameState = 'gameover';
        this.stopGame();
        
        // Atualiza high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('tetrisHighScore', this.highScore);
        }
        
        // Salva score na plataforma
        if (window.gamePlatform) {
            window.gamePlatform.saveScore('Jogador', 'tetris', this.score);
        }
        
        // Mostra tela de game over
        this.showGameOverScreen();
        
        console.log('💀 Game Over! Score:', this.score);
    }

    // 🏆 MOSTRAR TELA DE GAME OVER
    showGameOverScreen() {
        // Remove tela existente se houver
        const existingScreen = document.querySelector('.game-over-screen');
        if (existingScreen) {
            existingScreen.remove();
        }
        
        const gameOverHTML = `
            <div class="game-over-screen">
                <div class="game-over-content">
                    <h1 class="game-over-title">💀 Game Over</h1>
                    
                    <div class="result-stats">
                        <div class="result-stat">
                            <span class="stat-label">Score Final</span>
                            <span class="stat-number">${this.score.toLocaleString()}</span>
                        </div>
                        <div class="result-stat">
                            <span class="stat-label">Level</span>
                            <span class="stat-number">${this.level}</span>
                        </div>
                        <div class="result-stat">
                            <span class="stat-label">Lines</span>
                            <span class="stat-number">${this.linesCleared}</span>
                        </div>
                        <div class="result-stat">
                            <span class="stat-label">Recorde</span>
                            <span class="stat-number">${this.highScore.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="control-buttons">
                        <button id="game-over-play-again" class="tetris-btn">🔄 Jogar Novamente</button>
                        <button id="game-over-main-menu" class="tetris-btn secondary">🏠 Menu Principal</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', gameOverHTML);
        
        // Configura eventos dos botões
        document.getElementById('game-over-play-again').addEventListener('click', () => {
            document.querySelector('.game-over-screen')?.remove();
            this.reset();
            this.startGame();
        });
        
        document.getElementById('game-over-main-menu').addEventListener('click', () => {
            document.querySelector('.game-over-screen')?.remove();
            if (window.gamePlatform) {
                window.gamePlatform.showPage('games');
            }
        });
    }

    // 🎮 MOSTRAR AJUDA DE CONTROLES
    showControlsHelp() {
        // Remove modal existente se houver
        const existingModal = document.querySelector('.controls-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const controlsHTML = `
            <div class="controls-modal">
                <div class="controls-content">
                    <h3 class="controls-title">🎮 Controles do Tetris</h3>
                    
                    <div class="control-list">
                        <div class="control-item">
                            <span>Mover Esquerda</span>
                            <span class="control-key">← ou A</span>
                        </div>
                        <div class="control-item">
                            <span>Mover Direita</span>
                            <span class="control-key">→ ou D</span>
                        </div>
                        <div class="control-item">
                            <span>Rotacionar</span>
                            <span class="control-key">↑ ou W</span>
                        </div>
                        <div class="control-item">
                            <span>Soft Drop</span>
                            <span class="control-key">↓ ou S</span>
                        </div>
                        <div class="control-item">
                            <span>Hard Drop</span>
                            <span class="control-key">Espaço</span>
                        </div>
                        <div class="control-item">
                            <span>Hold Piece</span>
                            <span class="control-key">C ou Shift</span>
                        </div>
                        <div class="control-item">
                            <span>Pausar</span>
                            <span class="control-key">P ou Espaço</span>
                        </div>
                    </div>
                    
                    <button id="close-controls" class="tetris-btn" style="margin-top: 20px; width: 100%;">Fechar</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        
        document.getElementById('close-controls').addEventListener('click', () => {
            document.querySelector('.controls-modal')?.remove();
        });
        
        // Fecha modal ao clicar fora
        document.querySelector('.controls-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('controls-modal')) {
                document.querySelector('.controls-modal')?.remove();
            }
        });
    }

    // 🎨 UTILITÁRIOS DE COR
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return "#" + (
            (1 << 24) +
            (R << 16) +
            (G << 8) +
            B
        ).toString(16).slice(1).toUpperCase();
    }

    lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + (
            (1 << 24) +
            (R << 16) +
            (G << 8) +
            B
        ).toString(16).slice(1).toUpperCase();
    }

    // 🧹 DESTRUIR JOGO
    destroy() {
        this.stopGame();
        
        // Remove elementos do jogo
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.innerHTML = '<canvas id="game-canvas"></canvas>';
        }
        
        // Remove telas modais se existirem
        document.querySelector('.game-over-screen')?.remove();
        document.querySelector('.controls-modal')?.remove();
        document.querySelector('.touch-controls')?.remove();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.boundKeyHandler);
    }
}