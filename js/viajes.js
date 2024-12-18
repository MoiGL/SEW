class Viajes {
    constructor() {
        this.latitud = null;
        this.longitud = null;

        this.obtenerGeolocalizacion();
    }

    // Obtener geolocalización del usuario
    obtenerGeolocalizacion() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (posicion) => this.mostrarGeolocalizacion(posicion),
                (error) => this.manejarError(error)
            );
        } else {
            alert("La geolocalización no está disponible en este navegador.");
        }
    }

    // Mostrar las coordenadas y los mapas
    mostrarGeolocalizacion(posicion) {
        this.latitud = posicion.coords.latitude;
        this.longitud = posicion.coords.longitude;

        // Mostrar coordenadas
        document.querySelector("[data-latitud]").textContent = this.latitud;
        document.querySelector("[data-longitud]").textContent = this.longitud;

        // Mostrar mapa estático
        const urlMapaEstatico = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitud},${this.longitud}&zoom=15&size=600x400&markers=${this.latitud},${this.longitud}&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU`;
        document.querySelector("[data-mapa-estatico]").src = urlMapaEstatico;

        // Mostrar mapa dinámico
        this.mostrarMapaDinamico();
    }

    // Mostrar el mapa dinámico (uso permitido de div)
    mostrarMapaDinamico() {
        const contenedorMapa = document.querySelector("[data-mapa-dinamico]");

        // Utilizar Google Maps API para el mapa dinámico
        const mapa = new google.maps.Map(contenedorMapa, {
            center: { lat: this.latitud, lng: this.longitud },
            zoom: 15,
        });

        new google.maps.Marker({
            position: { lat: this.latitud, lng: this.longitud },
            map: mapa,
            title: "Tu ubicación",
        });
    }

    // Manejo de errores en geolocalización
    manejarError(error) {
        let mensaje = "Error desconocido.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                mensaje = "Permiso denegado para obtener la ubicación.";
                break;
            case error.POSITION_UNAVAILABLE:
                mensaje = "La información de la ubicación no está disponible.";
                break;
            case error.TIMEOUT:
                mensaje = "Se agotó el tiempo de espera para obtener la ubicación.";
                break;
        }
        alert(mensaje);
    }
}


// Comportamiento del carrusel
document.addEventListener("DOMContentLoaded", () => {
    new Viajes();
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
