class Noticias {
    constructor() {
        // Verificar compatibilidad con la API File
        if (window.File && window.FileReader) {
            console.log("La API File es compatible con este navegador.");
        } else {
            alert("La API File no es soportada en tu navegador.");
        }

        this.inicializarEventos();
    }

    inicializarEventos() {
        // Seleccionar el primer input de tipo file
        const inputFile = document.querySelector("input[type='file']");
        inputFile.addEventListener("change", (event) => this.readInputFile(event));

        // Seleccionar el formulario para añadir noticias
        const form = document.querySelector("form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.agregarNuevaNoticia(form);
        });
    }

    readInputFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const contenido = e.target.result;
            this.mostrarNoticias(contenido);
        };
        reader.readAsText(file);
    }

    mostrarNoticias(contenido) {
        const contenedorNoticias = document.querySelectorAll("section")[1].querySelector("section");
        contenedorNoticias.innerHTML = "";

        const lineas = contenido.split("\n");
        lineas.forEach((linea) => {
            const [titulo, entradilla, autor] = linea.split("_");
            if (titulo && entradilla && autor) {
                const noticia = document.createElement("article");
                noticia.innerHTML = `
                    <h3>${titulo}</h3>
                    <p>${entradilla}</p>
                    <footer>Por: ${autor}</footer>
                `;
                contenedorNoticias.appendChild(noticia);
            }
        });
    }

    agregarNuevaNoticia(form) {
        const formData = new FormData(form);
        const titulo = formData.get("titulo");
        const entradilla = formData.get("entradilla");
        const autor = formData.get("autor");

        if (titulo && entradilla && autor) {
            const noticia = document.createElement("article");
            noticia.innerHTML = `
                <h3>${titulo}</h3>
                <p>${entradilla}</p>
                <footer>Por: ${autor}</footer>
            `;

            const contenedorNoticias = document.querySelectorAll("section")[1].querySelector("section");
            contenedorNoticias.appendChild(noticia);

            form.reset(); // Limpiar el formulario
        } else {
            alert("Todos los campos son obligatorios.");
        }
    }
}

// Instanciar la clase cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => new Noticias());
