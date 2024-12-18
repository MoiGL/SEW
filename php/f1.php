<?php
require_once 'F1Manager.php';
$f1 = new F1Manager();

// Obtener información
$pilotos = $f1->obtenerPilotosConEquipos(); // Pilotos con equipos
$estadisticas = $f1->obtenerEstadisticasPilotos(); // Estadísticas de pilotos
$resultados = isset($_GET['carrera_id']) ? $f1->obtenerResultadosCarrera($_GET['carrera_id']) : null; // Resultados de carrera específica
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión F1</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/f1.css" />
    <link rel="icon" href="../multimedia/img/favicon.ico" type="image/x-icon">
    <title>F1 Desktop - Inicio</title>
</head>

<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
        <!-- Datos con el contenido que aparece en el navegador -->
        <nav>
            <a href="../index.html">Página principal</a>
            <a href="../piloto.html">Piloto</a>
            <a href="../noticias.html">Noticias</a>
            <a href="../calendario.html">Calendario</a>
            <a href="../meteorologia.html">Meterologia</a>
            <a href="../circuito.html">Circuito</a>
            <a href="viajes.php">Viajes</a>
            <a href="../juegos.html">Juegos</a>
            <a class="active" href="php/f1.php">F1Manager</a>
        </nav>

    </header>

    <section>
        <h2>Listado de Pilotos y Equipos</h2>
        <table>
            <thead>
                <tr>
                    <th>Piloto</th>
                    <th>Apellido</th>
                    <th>Nacionalidad</th>
                    <th>Equipo</th>
                    <th>Motor</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($piloto = $pilotos->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($piloto['piloto']) ?></td>
                        <td><?= htmlspecialchars($piloto['apellido']) ?></td>
                        <td><?= htmlspecialchars($piloto['nacionalidad']) ?></td>
                        <td><?= htmlspecialchars($piloto['equipo']) ?></td>
                        <td><?= htmlspecialchars($piloto['motor']) ?></td>
                        <td>
                            <form method="post" action="eliminarPiloto.php"
                                onsubmit="return confirm('¿Seguro que deseas eliminar este piloto?');">
                                <input type="hidden" name="id" value="<?= $piloto['id'] ?>">
                                <input type="submit" value="Eliminar">
                            </form>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </section>

    <section>
        <h2>Estadísticas de Pilotos</h2>
        <table>
            <thead>
                <tr>
                    <th>Piloto</th>
                    <th>Apellido</th>
                    <th>Total Puntos</th>
                    <th>Podios</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($estadistica = $estadisticas->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($estadistica['piloto']) ?></td>
                        <td><?= htmlspecialchars($estadistica['apellido']) ?></td>
                        <td><?= htmlspecialchars($estadistica['total_puntos']) ?></td>
                        <td><?= htmlspecialchars($estadistica['podios']) ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </section>

    <section>
        <h2>Resultados de Carrera</h2>
        <form method="get">
            <label for="carrera_id">ID de Carrera:</label>
            <input type="number" id="carrera_id" name="carrera_id" required>
            <input type="submit" value="Consultar">
        </form>
        <?php if ($resultados): ?>
            <table>
                <thead>
                    <tr>
                        <th>Carrera</th>
                        <th>Piloto</th>
                        <th>Apellido</th>
                        <th>Posición</th>
                        <th>Tiempo</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($resultado = $resultados->fetch_assoc()): ?>
                        <tr>
                            <td><?= htmlspecialchars($resultado['carrera']) ?></td>
                            <td><?= htmlspecialchars($resultado['piloto']) ?></td>
                            <td><?= htmlspecialchars($resultado['apellido']) ?></td>
                            <td><?= htmlspecialchars($resultado['posicion']) ?></td>
                            <td><?= htmlspecialchars($resultado['tiempo']) ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </section>

    <section>
        <form method="post" action="importar.php" enctype="multipart/form-data">
            <h2>Importar Pilotos desde CSV</h2>
            <input type="file" name="archivo" accept=".csv" required>
            <button type="submit">Importar</button>
        </form>

        <form method="post" action="exportar.php">
            <h2>Exportar Pilotos a CSV</h2>
            <button type="submit" name="exportar">Exportar</button>
        </form>
    </section>
</body>

</html>