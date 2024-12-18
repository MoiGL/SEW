class Circuito {
    constructor() {
        this.mapa = null; // Mapa dinámico
        this.contenedorMapa = document.querySelector("div");
        this.contenedorInfo = document.querySelector("section:nth-of-type(2) article");
        this.contenedorSVG = document.querySelector("section:nth-child(8) > figure");

        this.inputFileXML = document.querySelector("input[accept='.xml']");
        this.inputFileKML = document.querySelector("input[accept='.kml']");
        this.inputFileSVG = document.querySelector("input[accept='.svg']");

        this.inicializarEventos();
        this.cargarGoogleMaps();
    }

    // Cargar Google Maps API
    cargarGoogleMaps() {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU&callback=inicializarMapa`;
        script.async = true;
        script.defer = true;
        window.inicializarMapa = this.inicializarMapa.bind(this);
        document.head.appendChild(script);
    }

    inicializarMapa() {
        this.mapa = new google.maps.Map(this.contenedorMapa, {
            center: { lat: 47.22331629584274, lng: 14.77049470309878 },
            zoom: 14,
        });
    }

    inicializarEventos() {
        this.inputFileXML.addEventListener("change", (e) => this.leerArchivo(e, "xml"));
        this.inputFileKML.addEventListener("change", (e) => this.leerArchivo(e, "kml"));
        this.inputFileSVG.addEventListener("change", (e) => this.leerArchivo(e, "svg"));
    }

    leerArchivo(event, tipo) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (tipo === "xml") this.procesarXML(e.target.result);
            else if (tipo === "kml") this.procesarKML(e.target.result);
            else if (tipo === "svg") this.procesarSVG(e.target.result);
        };
        reader.readAsText(file);
    }

    procesarXML(contenido) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(contenido, "application/xml");
    
        const nombre = xml.querySelector("nombre").textContent;
        const recorrido = xml.querySelector("recorrido").textContent;
        const anchura = xml.querySelector("anchura").textContent;
        const fecha = xml.querySelector("fecha").textContent;
        const hora = xml.querySelector("hora").textContent;
        const vueltas = xml.querySelector("vueltas").textContent;
        const localidad = xml.querySelector("localidad").textContent;
        const pais = xml.querySelector("pais").textContent;
    
        // Obtener referencias
        const referencias = Array.from(xml.querySelectorAll("referencias referencia"))
            .map(ref => `<li><a href="${ref.textContent}" target="_blank">${ref.textContent}</a></li>`)
            .join("");
    
        // Obtener imágenes de la galería
        const galeria = Array.from(xml.querySelectorAll("galeria imagen"))
            .map(img => `
                <div>
                    <img src="${img.getAttribute("ruta")}" alt="${img.getAttribute("descripcion")}" />
                    <p>${img.getAttribute("descripcion")}</p>
                </div>
            `).join("");
    
        // Obtener videos
        const videos = Array.from(xml.querySelectorAll("videos video"))
            .map(video => `
                <div>
                    <video controls src="${video.getAttribute("ruta")}"></video>
                    <p>${video.getAttribute("descripcion")}</p>
                </div>
            `).join("");
    
        // Obtener coordenadas
        const coordenadas = xml.querySelector("coordenadas");
        const latitud = coordenadas.querySelector("latitud").textContent;
        const longitud = coordenadas.querySelector("longitud").textContent;
        const altitud = coordenadas.querySelector("altitud").textContent;
    
        // Obtener tramos
        const tramos = Array.from(xml.querySelectorAll("tramos tramo"))
            .map(tramo => `
                <tr>
                    <td>${tramo.getAttribute("distancia")}</td>
                    <td>${tramo.querySelector("latitud").textContent}</td>
                    <td>${tramo.querySelector("longitud").textContent}</td>
                    <td>${tramo.querySelector("altitud").textContent}</td>
                    <td>${tramo.querySelector("sector").textContent}</td>
                </tr>
            `).join("");
    
        // Actualizar contenido
        this.contenedorInfo.innerHTML = `
            <h3>${nombre}</h3>
            <p>Recorrido: ${recorrido} km</p>
            <p>Anchura: ${anchura} m</p>
            <p>Fecha: ${fecha}</p>
            <p>Hora: ${hora}</p>
            <p>Vueltas: ${vueltas}</p>
            <p>Localidad: ${localidad}</p>
            <p>País: ${pais}</p>
            
            <h4>Referencias</h4>
            <ul>${referencias}</ul>
            
            <h4>Galería</h4>
            <div>${galeria}</div>
            
            <h4>Videos</h4>
            <div>${videos}</div>
            
            <h4>Coordenadas</h4>
            <p>Latitud: ${latitud}</p>
            <p>Longitud: ${longitud}</p>
            <p>Altitud: ${altitud} m</p>
            
            <h4>Tramos</h4>
            <table border="1">
                <thead>
                    <tr>
                        <th>Distancia</th>
                        <th>Latitud</th>
                        <th>Longitud</th>
                        <th>Altitud</th>
                        <th>Sector</th>
                    </tr>
                </thead>
                <tbody>${tramos}</tbody>
            </table>
        `;
    }
    

    procesarKML(contenidoKML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(contenidoKML, "application/xml");
        const coordenadas = xml.querySelector("coordinates").textContent.trim();

        const puntos = coordenadas.split(/\s+/).map((coord) => {
            const [lng, lat] = coord.split(",").map(Number);
            return { lat, lng };
        });

        const ruta = new google.maps.Polyline({
            path: puntos,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });
        ruta.setMap(this.mapa);
    }

    procesarSVG(contenidoSVG) {
        // Limpiar el contenido previo
        this.contenedorSVG.innerHTML = "";

        // Insertar el contenido SVG directamente en el DOM
        const parser = new DOMParser();
        const svg = parser.parseFromString(contenidoSVG, "image/svg+xml").documentElement;

        // Asegurarse de que se muestra correctamente
        svg.style.width = "100%";
        svg.style.height = "auto";

        this.contenedorSVG.appendChild(svg);
    }
}

// Inicializar la clase Circuito cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => new Circuito());
