// Clase Viajes
class Viajes {
    constructor() {
        this.latitude = null; // Coordenada de latitud
        this.longitude = null; // Coordenada de longitud
        this.errorMessage = null; // Mensaje de error
    }

    // Método para inicializar la geolocalización
    init() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.showStaticMap();
                    this.showDynamicMap();
                },
                (error) => {
                    this.handleGeolocationError(error);
                }
            );
        } else {
            this.errorMessage = "La geolocalización no está soportada en este navegador.";
            this.displayError();
        }
    }

    // Manejo de errores de geolocalización
    handleGeolocationError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.errorMessage = "El usuario denegó la solicitud de geolocalización.";
                break;
            case error.POSITION_UNAVAILABLE:
                this.errorMessage = "La información de ubicación no está disponible.";
                break;
            case error.TIMEOUT:
                this.errorMessage = "La solicitud para obtener la ubicación expiró.";
                break;
            default:
                this.errorMessage = "Ocurrió un error desconocido.";
        }
        this.displayError();
    }

    // Método para mostrar un mapa estático con su propio artículo
    showStaticMap() {
        const article = this.createArticle();
        this.addTitle("Mapa Estático", article);

        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=15&size=600x300&markers=color:red%7C${this.latitude},${this.longitude}&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU`;
        const img = document.createElement("img");
        img.setAttribute("src", mapUrl);
        img.setAttribute("alt", "Mapa estático mostrando la ubicación actual");

        article.appendChild(img);
    }

    // Método para mostrar un mapa dinámico con su propio artículo
    showDynamicMap() {
        const article = this.createArticle();
        this.addTitle("Mapa Dinámico", article);

        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU&callback=initDynamicMap";
        script.async = true;
        document.head.appendChild(script);

        // Callback para inicializar el mapa dinámico
        window.initDynamicMap = () => {
            const mapElement = document.createElement("div");
            mapElement.setAttribute("style", "width: 100%; height: 400px;"); // Estilos en línea
            article.appendChild(mapElement);

            new google.maps.Map(mapElement, {
                center: { lat: this.latitude, lng: this.longitude },
                zoom: 15,
            });
        };
    }

    // Mostrar mensajes de error en su propio artículo
    displayError() {
        const article = this.createArticle();
        const errorElement = document.createElement("p");
        errorElement.textContent = this.errorMessage;
        article.appendChild(errorElement);
    }

    // Método para crear un nuevo <article> y añadirlo al <main>
    createArticle() {
        const main = document.querySelector("main");
        const article = document.createElement("article");
        main.appendChild(article);
        return article;
    }

    // Método para añadir un título a un artículo específico
    addTitle(text, article) {
        const title = document.createElement("h2");
        title.textContent = text;
        article.appendChild(title);
    }
}



// Comportamiento del carrusel
document.addEventListener("DOMContentLoaded", () => {
    const viajes = new Viajes();
    viajes.init();
    const images = document.querySelectorAll("article img"); // Selecciona todas las imágenes del carrusel
    const nextButton = document.querySelector("button[aria-label='Next']"); // Botón "Next"
    const prevButton = document.querySelector("button[aria-label='Prev']"); // Botón "Prev"
    let currentIndex = 0; // Índice de la imagen actual

    // Oculta todas las imágenes excepto la primera
    const updateImages = () => {
        images.forEach((img, index) => {
            img.style.display = index === currentIndex ? "block" : "none";
        });
    };

    // Muestra la siguiente imagen
    const showNextImage = () => {
        currentIndex = (currentIndex + 1) % images.length; // Avanza al siguiente índice
        updateImages();
    };

    // Muestra la imagen anterior
    const showPrevImage = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Retrocede al índice anterior
        updateImages();
    };

    // Agrega los eventos de clic a los botones
    nextButton.addEventListener("click", showNextImage);
    prevButton.addEventListener("click", showPrevImage);

    // Inicializa el carrusel mostrando solo la primera imagen
    updateImages();
});

