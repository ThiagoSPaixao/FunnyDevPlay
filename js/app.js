class GamePlatform {
    constructor() {

        this.currentGame = null;
        this.currentPage = 'home';
        this.scores = [];
        
        this.init();
    }

    init() {
        console.log('🚀 Inicializando Plataforma de Jogos...');
        
        this.setupNavigation();
        this.setupGameCards();
        this.setupBackButton();
        this.loadScores();
        
        this.showPage('home');
    }