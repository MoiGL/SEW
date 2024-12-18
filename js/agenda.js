// agenda.js

class Agenda {
    constructor() {
        // URL base para consultar las carreras de la temporada actual
        this.apiUrl = 'https://ergast.com/api/f1/current.json';
    }

    // Método para obtener la información de las carreras
    obtenerCarreras() {
        $.ajax({
            url: this.apiUrl,
            method: 'GET',
            success: (data) => {
                const carreras = data.MRData.RaceTable.Races;
                this.mostrarCarreras(carreras);
            },
            error: (err) => {
                console.error('Error al obtener la información de las carreras:', err);
            }
        });
    }

    // Método para mostrar la información de las carreras en la página
    mostrarCarreras(carreras) {
        let html = `<h2>Calendario de Carreras - Temporada ${new Date().getFullYear()}</h2>`;
        html += `<section>`;

        carreras.forEach((carrera) => {
            html += `
                <article>
                    <h3>${carrera.raceName}</h3>
                    <p><strong>Circuito:</strong> ${carrera.Circuit.circuitName}</p>
                    <p><strong>Fecha:</strong> ${carrera.date}</p>
                    <p><strong>Hora:</strong> ${carrera.time || 'No disponible'}</p>
                    <p><strong>Coordenadas:</strong> ${carrera.Circuit.Location.lat}, ${carrera.Circuit.Location.long}</p>
                    <p><strong>Ubicación:</strong> ${carrera.Circuit.Location.locality}, ${carrera.Circuit.Location.country}</p>
                </article>
            `;
        });

        html += `</section>`;
        $('body').append(html);
    }
}

$(document).ready(() => {
    const agenda = new Agenda();

    // Botón para cargar la información
    $('button').on('click', () => {
        agenda.obtenerCarreras();
    });
});
