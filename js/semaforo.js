class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        // Inicializamos dificultad de forma aleatoria
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];

        // Creamos la estructura del semáforo
        this.createStructure();
    }

    createStructure() {
        const main = document.querySelector('main');

        // Título del juego
        const header = document.createElement('h2');
        header.textContent = "¡Mide tu tiempo de reacción!";
        main.appendChild(header);

        // Contenedor de luces
        const lightContainer = document.createElement('section');
        lightContainer.classList.add('light-container');
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
            light.classList.add('light');
            lightContainer.appendChild(light);
        }
        main.appendChild(lightContainer);

        // Botón de arranque
        const startButton = document.createElement('button');
        startButton.textContent = "Arranque";
        startButton.onclick = () => this.initSequence(startButton);
        main.appendChild(startButton);

        // Botón de reacción
        const reactionButton = document.createElement('button');
        reactionButton.textContent = "Reacción";
        reactionButton.disabled = true;
        reactionButton.onclick = () => this.stopReaction(reactionButton, startButton);
        main.appendChild(reactionButton);

        // Resultado del tiempo
        const result = document.createElement('p');
        result.id = 'result';
        main.appendChild(result);
    }

    initSequence(startButton) {
        const main = document.querySelector('main');
        main.classList.add('load'); // Añade animación de encendido
        startButton.disabled = true; // Deshabilita el botón de arranque
        // Tiempo de apagado basado en dificultad
        setTimeout(() => {
            this.unload_moment = new Date();
            main.classList.remove('load');
            main.classList.add('unload'); // Añade animación de apagado
            document.querySelector('button:nth-of-type(2)').disabled = false; // Habilita botón "Reacción"
        }, 2000 + this.difficulty * 1000);
        
    }


    stopReaction(reactionButton, startButton) {
        this.clic_moment = new Date();
        const reactionTime = (this.clic_moment - this.unload_moment) / 1000;
        const roundedTime = Number(reactionTime).toFixed(3);

        // Muestra el resultado
        document.getElementById('result').textContent = `Tu tiempo de reacción es: ${roundedTime} segundos`;

        // Restablece estado inicial
        document.querySelector('main').classList.remove('unload');
        reactionButton.disabled = true;
        startButton.disabled = false;
        this.createRecordForm(reactionTime);
    }

    createRecordForm(reactionTime) {
        const form = `
        <form method="POST" action="semaforo.php">
            <label>Nombre: <input type="text" name="nombre" required></label><br>
            <label>Apellidos: <input type="text" name="apellidos" required></label><br>
            <label>Nivel: <input type="number" name="nivel" value="${this.difficulty}" readonly></label><br>
            <label>Tiempo: <input type="number" step="0.01" name="tiempo" value="${reactionTime}" readonly></label><br>
            <input type="submit" value="Guardar Récord">
        </form>
    `;
        document.querySelector('main').insertAdjacentHTML('beforeend', form);
    }
}

const juego = new Semaforo();
