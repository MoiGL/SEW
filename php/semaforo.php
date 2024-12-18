<?php
// Clase Record para gestionar la base de datos
class Record
{
    private $server = "localhost";
    private $user = "DBUSER2024";
    private $pass = "DBPSWD2024";
    private $dbname = "records";
    private $conn;

    public function __construct()
    {
        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }
    }

    public function insertarRecord($nombre, $apellidos, $nivel, $tiempo)
    {
        $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);
        $stmt->execute();
        $stmt->close();
    }

    public function obtenerTopRecords($nivel)
    {
        $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
        $stmt->bind_param("i", $nivel);
        $stmt->execute();
        $result = $stmt->get_result();
        $records = [];
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
        $stmt->close();
        return $records;
    }

    public function __destruct()
    {
        $this->conn->close();
    }
}

// Procesamiento del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $record = new Record();
    $record->insertarRecord($_POST['nombre'], $_POST['apellidos'], $_POST['nivel'], $_POST['tiempo']);
    // Redirigir para evitar el reenvío del formulario
    header("Location: " . $_SERVER['PHP_SELF'] . "?nivel=" . urlencode($_POST['nivel']));
    exit; // Importante: Finaliza el script después de redirigir
}

// Obtener registros si el parámetro GET 'nivel' está presente
if (isset($_GET['nivel'])) {
    $record = new Record();
    $topRecords = $record->obtenerTopRecords($_GET['nivel']);
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego de Semáforo</title>
    <link rel="stylesheet" type="text/css" href="../estilo/semaforo_grid.css">
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
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
            <a href="../php/viajes.php">Viajes</a>
            <a class="active" href="../juegos.html">Juegos</a>
            <a href="../php/f1.php">F1Manager</a>
        </nav>
    </header>
    <p>Estás en: <a href="../index.html">Inicio</a> >> Juegos >> Semáforo</p>

    <!-- Menú de Juegos -->
    <section>
        <h2>Juegos Disponibles</h2>
        <ul>
            <li><a href="../memoria.html">Juego 1: Memoria</a></li>
            <li><a href="semaforo.php">Juego 2: Semáforo</a></li>
            <li><a href="../api.html">API F1</a></li>
            <li><a href="juego4.html">Juego 4: Desafío de Tiempos</a></li>
        </ul>
    </section>
    <!-- Formulario generado dinámicamente -->
    <main>
        <?php if (isset($topRecords)): ?>
            <h3>Top 10 Récords</h3>
            <ol>
                <?php foreach ($topRecords as $record): ?>
                    <li><?php echo "{$record['nombre']} {$record['apellidos']} - " . number_format($record['tiempo'], 3) . " segundos"; ?>
                    </li>
                <?php endforeach; ?>
            </ol>
        <?php endif; ?>
    </main>

    <footer>&copy; 2024 - F1 Desktop Project</footer>
    <script src="../js/semaforo.js"></script>
</body>

</html>