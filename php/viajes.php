<?php
class Carrusel
{
    private $capital;
    private $pais;

    public function __construct($capital, $pais)
    {
        $this->capital = $capital;
        $this->pais = $pais;
    }

    public function getPais()
    {
        return $this->pais;
    }

    public function obtenerImagenes()
    {
        $params = array(
            'api_key' => '6da2b40d1839a7571aa2cc3b9b51b51d',
            'method' => 'flickr.photos.search',
            'tags' => urlencode($this->pais),
            'format' => 'php_serial',
            'per_page' => 10,
            'page' => 1,
            'safe_search' => 1,
            'content_type' => 1
        );

        $encoded_params = [];
        foreach ($params as $k => $v) {
            $encoded_params[] = urlencode($k) . '=' . urlencode($v);
        }
        $url = "https://api.flickr.com/services/rest/?" . implode('&', $encoded_params);

        $rsp = file_get_contents($url);
        if ($rsp === false) {
            throw new Exception("Error al obtener datos de Flickr.");
        }

        $rsp_obj = unserialize($rsp);
        if ($rsp_obj['stat'] !== 'ok') {
            throw new Exception("Error en la respuesta de Flickr: " . $rsp_obj['message']);
        }

        $imagenes = [];
        foreach ($rsp_obj['photos']['photo'] as $photo) {
            $farm_id = $photo['farm'];
            $server_id = $photo['server'];
            $photo_id = $photo['id'];
            $secret_id = $photo['secret'];
            $size = 'm';

            $photo_url = "https://farm{$farm_id}.staticflickr.com/{$server_id}/{$photo_id}_{$secret_id}_{$size}.jpg";
            $imagenes[] = $photo_url;
        }

        return $imagenes;
    }
}

class Moneda
{
    private $monedaLocal;
    private $monedaCambio;

    public function __construct($monedaLocal, $monedaCambio = 'EUR')
    {
        $this->monedaLocal = $monedaLocal;
        $this->monedaCambio = $monedaCambio;
    }

    public function obtenerCambio()
    {
        $url = "https://open.er-api.com/v6/latest/{$this->monedaCambio}";
        $respuesta = file_get_contents($url);

        if ($respuesta === false) {
            throw new Exception("Error al obtener datos del servicio de cambio.");
        }

        $datos = json_decode($respuesta, true);
        if (isset($datos['rates'][$this->monedaLocal])) {
            return $datos['rates'][$this->monedaLocal];
        } else {
            throw new Exception("No se pudo obtener el cambio para la moneda especificada.");
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Viajes - F1 Desktop</title>
    <link rel="stylesheet" href="../estilo/carrusel_grid.css">
    <link rel="stylesheet" href="../estilo/estilo.css">
    <link rel="stylesheet" href="../estilo/layout.css">
    <link rel="icon" href="../multimedia/img/favicon.ico" type="image/x-icon">
</head>
<body>
    <header>
        <h1><a href="../index.html">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html">Página principal</a>
            <a href="../piloto.html">Piloto</a>
            <a href="../noticias.html">Noticias</a>
            <a href="../calendario.html">Calendario</a>
            <a href="../meteorologia.html">Meteorología</a>
            <a href="../circuito.html">Circuito</a>
            <a class="active" href="../viajes.html">Viajes</a>
            <a href="../juegos.html">Juegos</a>
            <a href="f1.php">F1Manager</a>
        </nav>
    </header>
    <p>Estás en: <a href="../index.html">Inicio</a> >> Viajes</p>

    <main>
        <h2>Carrusel de Imágenes de Viajes</h2>
        <article>
            <?php
            $carrusel = new Carrusel('Viena', 'Austria');
            $imagenes = $carrusel->obtenerImagenes();

            foreach ($imagenes as $imagen) {
                echo "<img src='{$imagen}' alt='Imagen de {$carrusel->getPais()}'>";
            }
            ?>
            <button aria-label="Next">&#10095;</button>
            <button aria-label="Prev">&#10094;</button>
        </article>

        <h2>Cambio de Moneda</h2>
        <section>
            <?php
            try {
                $moneda = new Moneda('USD');
                $cambio = $moneda->obtenerCambio();
                echo "<p>1 EUR equivale a {$cambio} USD</p>";
            } catch (Exception $e) {
                echo "<p>Error: {$e->getMessage()}</p>";
            }
            ?>
        </section>
    </main>

    <script src="../js/viajes.js" defer></script>
    <footer>&copy; 2024 - F1 Desktop Project</footer>
</body>
</html>
