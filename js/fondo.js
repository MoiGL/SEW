// fondo.js

// Clase Fondo
class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
        this.apiKey = '6da2b40d1839a7571aa2cc3b9b51b51d'; // Reemplaza con tu API Key de Flickr
        this.apiUrl = 'https://api.flickr.com/services/rest/?';
    }

    // Método para realizar una consulta a la API de Flickr
    obtenerImagenFondo() {
        // Parámetros de la consulta a la API
        const parametros = {
            method: 'flickr.photos.search',
            api_key: this.apiKey,
            text: `${this.circuito} ${this.pais}`,
            format: 'json',
            nojsoncallback: 1,
            per_page: 1
        };

        // Construir la URL de la API con los parámetros
        const url = this.apiUrl + $.param(parametros);

        // Llamada AJAX a la API
        $.ajax({
            url: url,
            method: 'GET',
            success: (data) => {
                if (data.photos && data.photos.photo.length > 0) {
                    const foto = data.photos.photo[0];
                    const imageUrl = `https://live.staticflickr.com/${foto.server}/${foto.id}_${foto.secret}_b.jpg`;
                    this.establecerImagenFondo(imageUrl);
                } else {
                    console.error('No se encontraron imágenes.');
                }
            },
            error: (err) => {
                console.error('Error en la llamada a la API de Flickr:', err);
            }
        });
    }

    // Método para establecer la imagen como fondo en el documento HTML
    establecerImagenFondo(imageUrl) {
        $('body').css('background-image', `url('${imageUrl}')`);
        $('body').css('background-size', 'cover');
    }
}

// Instancia de la clase Fondo y llamada al método
$(document).ready(() => {
    const fondo = new Fondo('Austria', 'Viena', 'Red Bull Ring');
    fondo.obtenerImagenFondo();
});
