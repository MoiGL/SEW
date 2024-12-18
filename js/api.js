class AppF1 {
    constructor() {
        this.listaCircuitos = [];
        this.init();
    }

    init() {
        document.querySelector("form").addEventListener("submit", (event) => this.registrarCircuito(event));
        this.mostrarCircuitos();
        document.querySelector("main section:nth-child(3) button").addEventListener("click", () => this.reproducirSonido());
    }

    registrarCircuito(event) {
        event.preventDefault();

        const nombre = event.target.nombre.value;
        const distancia = event.target.distancia.value;
        const archivo = event.target.archivo.files[0];

        if (archivo) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const detalles = e.target.result;
                this.guardarCircuito({ nombre, distancia, detalles });
                event.target.reset();
                this.reproducirSonido();
            };
            reader.readAsText(archivo);
        } else {
            this.guardarCircuito({ nombre, distancia, detalles: "No se proporcionaron detalles." });
            event.target.reset();
            this.reproducirSonido();
        }
    }

    guardarCircuito(circuito) {
        this.listaCircuitos.push(circuito);
        localStorage.setItem("circuitos", JSON.stringify(this.listaCircuitos));
        this.mostrarCircuitos();
    }

    mostrarCircuitos() {
        const ul = document.querySelector("main section:nth-child(2) ul");
        ul.innerHTML = "";
        this.listaCircuitos = JSON.parse(localStorage.getItem("circuitos")) || [];
        this.listaCircuitos.forEach((circuito) => {
            const li = document.createElement("li");
            li.textContent = `Nombre: ${circuito.nombre}, Distancia: ${circuito.distancia} km, Detalles: ${circuito.detalles}`;
            ul.appendChild(li);
        });
    }

    // Nueva funcionalidad: Reproducir sonido usando la API Web Audio
    reproducirSonido() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine"; // Tipo de onda (puedes cambiar a "square", "triangle", etc.)
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Frecuencia en Hz
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 200); // Duración del sonido en milisegundos
    }
}

document.addEventListener("DOMContentLoaded", () => new AppF1());
