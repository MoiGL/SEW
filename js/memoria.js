class Memoria {
    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.elements = this.createElements();
        this.shuffleElements();
        this.addListeners();
    }

    createElements() {
        return [
            { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
            { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
            { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
            { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
            { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
            { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
        ].flatMap(e => [e, e]); // Duplicar cada elemento
    }

    shuffleElements() {
        this.elements.sort(() => Math.random() - 0.5);
    }

    addListeners() {
        const board = document.querySelector("[data-board='memory']");
        const cards = board.querySelectorAll("article");

        // Asignar las imágenes y elementos dinámicamente
        cards.forEach((card, index) => {
            const { element, source } = this.elements[index];
            card.dataset.element = element;

            const front = card.querySelector("img[data-face='front']");
            front.src = source;
            front.alt = element;

            // Agregar el event listener
            card.addEventListener("click", () => this.flipCard(card));
        });
    }

    flipCard(card) {
        if (this.lockBoard || card === this.firstCard) return;

        card.setAttribute("data-card", "flipped");

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card;
            return;
        }

        this.secondCard = card;
        this.checkForMatch();
    }

    checkForMatch() {
        const isMatch = this.firstCard.dataset.element === this.secondCard.dataset.element;
        isMatch ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.removeEventListener("click", () => this.flipCard(this.firstCard));
        this.secondCard.removeEventListener("click", () => this.flipCard(this.secondCard));
        this.resetBoard();
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.setAttribute("data-card", "hidden");
            this.secondCard.setAttribute("data-card", "hidden");
            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        [this.hasFlippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }
}

// Inicializar el juego
const memoria = new Memoria();
