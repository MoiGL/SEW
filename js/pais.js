// pais.js

class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.circuito = "Red Bull Ring";
        this.gobierno = "República Federal";
        this.coordenadas = { latitud: 47.222912, longitud: 14.763666 };
        this.religion = "Cristianismo";
        this.apiKey = 'b4723839cff632ec277abce78c1c61f2'; // Reemplaza con tu API Key
    }

    // Método para obtener el tiempo del circuito
    obtenerTiempo(callback) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.coordenadas.latitud}&lon=${this.coordenadas.longitud}&lang=es&units=metric&appid=${this.apiKey}`;

        $.ajax({
            url: url,
            method: 'GET',
            success: (data) => {
                callback(data);
            },
            error: (err) => {
                console.error('Error al obtener los datos del tiempo:', err);
            }
        });
    }

    // Métodos para acceder a la información
    getInformacionPrincipal() {
        return `País: ${this.nombre}, Capital: ${this.capital}`;
    }


    getInformacionSecundaria() {
        return `<ul> <li>Circuito: ${this.circuito}</li>
                    <li>Población: ${this.poblacion}</li>
                    <li>Gobierno: ${this.gobierno}</li>
                    <li>Religión Mayoritaria: ${this.religion}</li>
                </ul>`
            ;
    }

    escribirCoordenadas() {
        document.write(`<p>Coordenadas del circuito: ${this.coordenadas.latitud}, ${this.coordenadas.longitud}</p>`);
    }
}
// Crear un objeto de la clase País con los datos de Austria
const austria = new Pais("Austria", "Viena", "8,859,449");

document.addEventListener('DOMContentLoaded', () => {
    austria.obtenerTiempo((data) => {
        let html = `<h2>Pronóstico del tiempo para los próximos 5 días</h2>`;
        html += `<section>`;
        data.list.forEach((item, index) => {
            if (index % 8 === 0) { // Cada 24 horas
                html += `
                    <article>
                        <h3>${new Date(item.dt_txt).toLocaleDateString()}</h3>
                        <p>Temperatura Máxima: ${item.main.temp_max} °C</p>
                        <p>Temperatura Mínima: ${item.main.temp_min} °C</p>
                        <p>Humedad: ${item.main.humidity}%</p>
                        <p>Cantidad de lluvia: ${item.rain ? item.rain["3h"] + ' mm' : '0 mm'}</p>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icono del tiempo">
                        <p>${item.weather[0].description}</p>
                    </article>
                `;
            }
        });
        html += `</section>`;
        document.body.innerHTML += html;
    });
});
