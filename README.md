# 🎮 FunnyDevPlay — Plataforma de Mini-Jogos

[![GitHub repo](https://img.shields.io/badge/GitHub-FunnyDevPlay-181717?logo=github)](https://github.com/ThiagoSPaixao/FunnyDevPlay)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com/ThiagoSPaixao/FunnyDevPlay)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Thiago%20Paixão-0077B5?logo=linkedin)](https://www.linkedin.com/in/thiagospaix%C3%A3o/)

---

Bem-vindo à **FunnyDevPlay**, uma **plataforma web de mini-jogos** criada com **HTML5, CSS3 e JavaScript puro**.
Este projeto faz parte do meu **portfólio de desenvolvedor** e tem como objetivo demonstrar **habilidades em frontend, lógica de jogos e arquitetura modular**.

---

## 🚀 Objetivo

Construir uma **coleção interativa de mini-jogos** em um ambiente responsivo, rápido e acessível — tudo **do zero**, sem frameworks externos.

Cada jogo é um módulo independente, carregado dinamicamente dentro de uma interface única e intuitiva.

---

## 🧩 Tecnologias Principais

| Categoria              | Tecnologias                                    |
| ---------------------- | ---------------------------------------------- |
| **Frontend**           | HTML5, CSS3, JavaScript (Canvas / WebGL)       |
| **Backend (opcional)** | Node.js + Express                              |
| **Banco de Dados**     | MongoDB ou Firebase (para ranking e pontuação) |
| **Hospedagem**         | Netlify, Vercel ou GitHub Pages                |

---

## 🏗️ Estrutura do Projeto

```
plataforma-jogos/
├── index.html               # Página principal da plataforma
├── css/
│   ├── style.css            # Estilos gerais
│   └── responsive.css       # Responsividade
├── js/
│   ├── app.js               # Lógica principal e navegação
│   ├── games/               # Pasta dos jogos individuais
│   │   ├── tetris.js
│   │   ├── snake.js
│   │   ├── memory.js
│   │   ├── galaga.js
│   │   └── arkanoid.js
│   └── utils.js             # Funções auxiliares (sons, pontuação, etc.)
├── assets/
│   ├── images/
│   ├── sounds/
│   └── icons/
└── README.md
```

---

## 🧠 Conceitos Técnicos Utilizados

* **Classes ES6** → estrutura e encapsulamento de jogos
* **Async/Await** → carregamento assíncrono de recursos
* **Event Listeners** → interatividade total
* **DOM Manipulation** → atualização dinâmica da interface
* **Local Storage** → persistência local de pontuação
* **Dynamic Imports** → carregamento sob demanda de jogos
* **Array Methods (map, filter, sort)** → manipulação de dados

---

## 🕹️ Estrutura da Plataforma

1. 🏠 **Portal Principal (index.html)** — exibe os jogos disponíveis
2. 🎨 **Sistema de Navegação** — troca de telas sem recarregar a página
3. 📱 **Design Responsivo** — jogável em desktop e mobile
4. ⚙️ **Motor de Jogos (Game Engine Base)** — renderização e loop principal
5. 💾 **Sistema de Pontuação** — rankings locais e online
6. 🎯 **Controles Cross-Platform** — teclado, mouse e touch

---

## 🔊 Roadmap

* [ ] Criar o motor base de jogos (Game Engine)
* [ ] Implementar o primeiro jogo: **Snake**
* [ ] Adicionar sistema de áudio dinâmico
* [ ] Criar sistema de conquistas e ranking global
* [ ] Adicionar login via conta do Google (Firebase)
* [ ] Melhorar interface com animações e transições

---

## ⚡ Como Executar Localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/ThiagoSPaixao/FunnyDevPlay.git
   cd FunnyDevPlay
   ```
2. Abra o arquivo **index.html** no navegador
   *(ou utilize um servidor local, como Live Server no VSCode)*

> 💡 Caso deseje ativar o backend de pontuações, configure o Node.js e MongoDB/Firebase conforme instruções futuras na pasta `/server`.

---

## 🎨 Estilo Visual

* Cores vibrantes e contrastantes (tema **arcade moderno**)
* Ícones vetoriais otimizados em **SVG**
* Tipografia inspirada em **jogos retrô**
* Layout modular e responsivo

---

## 👨‍💻 Autor

**Thiago Paixão** — Desenvolvedor Frontend e criador da FunnyDevPlay

> “Jogos feitos com código, café e criatividade ☕🎮”

📫 Contato:

* 🌐 [Site oficial](https://funnydevplay.com)
* 💼 [LinkedIn](https://www.linkedin.com/in/thiagospaix%C3%A3o/)
* 🧑‍💻 [GitHub](https://github.com/ThiagoSPaixao)

---

## 🏁 Licença

Este projeto é de código aberto sob a licença **MIT**.
Sinta-se à vontade para estudar, modificar e contribuir!

---

⭐ **Se gostou do projeto, dê uma estrela no GitHub!**
Ajude a FunnyDevPlay a crescer e inspire outros devs a criarem seus próprios jogos web.

(Alterando o README)
