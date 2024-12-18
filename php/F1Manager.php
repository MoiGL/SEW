<?php
class F1Manager
{
    private $conexion;

    // Constructor: Establece la conexión a la base de datos
    public function __construct()
    {
        $this->conexion = new mysqli('localhost', 'DBUSER2024', 'DBPSWD2024', 'f1_database');
        if ($this->conexion->connect_error) {
            die("Conexión fallida: " . $this->conexion->connect_error);
        }
    }

    // Importar datos desde un archivo CSV a cualquier tabla
    public function importarCSV($archivo, $tabla)
    {
        if (!file_exists($archivo) || !is_readable($archivo)) {
            throw new Exception("El archivo CSV no existe o no se puede leer.");
        }

        $file = fopen($archivo, 'r');
        $columnas = fgetcsv($file); // Leer cabeceras

        $placeholders = implode(',', array_fill(0, count($columnas), '?'));
        $query = "INSERT INTO $tabla (" . implode(',', $columnas) . ") VALUES ($placeholders)";
        $stmt = $this->conexion->prepare($query);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->conexion->error);
        }

        while (($datos = fgetcsv($file)) !== false) {
            $tipos = str_repeat('s', count($datos)); // Asume que todos los campos son strings
            $stmt->bind_param($tipos, ...$datos);
            $stmt->execute();
        }

        fclose($file);
    }

    // Exportar datos de cualquier tabla a un archivo CSV
    public function exportarCSV($tabla, $archivo)
    {
        $file = fopen($archivo, 'w');
        if (!$file) {
            throw new Exception("No se pudo abrir el archivo para escritura.");
        }

        $result = $this->conexion->query("SELECT * FROM $tabla");
        if (!$result) {
            throw new Exception("Error al consultar la tabla: " . $this->conexion->error);
        }

        // Escribir cabecera
        $columnas = array_keys($result->fetch_assoc());
        fputcsv($file, $columnas);

        // Escribir datos
        $result->data_seek(0); // Reiniciar el cursor del resultado
        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }

        fclose($file);
    }

    // Obtener pilotos con sus equipos
    public function obtenerPilotosConEquipos()
    {
        $query = "SELECT pilotos.id, pilotos.nombre AS piloto, pilotos.apellido, pilotos.nacionalidad, 
                         equipos.nombre AS equipo, equipos.motor
                  FROM pilotos
                  JOIN equipos ON pilotos.equipo_id = equipos.id";
        $result = $this->conexion->query($query);

        if (!$result) {
            throw new Exception("Error al obtener pilotos con equipos: " . $this->conexion->error);
        }

        return $result;
    }

    // Obtener resultados de una carrera específica
    public function obtenerResultadosCarrera($carreraId)
    {
        $query = "SELECT carreras.nombre AS carrera, pilotos.nombre AS piloto, pilotos.apellido, resultados.posicion, resultados.tiempo
                  FROM resultados
                  JOIN carreras ON resultados.carrera_id = carreras.id
                  JOIN pilotos ON resultados.piloto_id = pilotos.id
                  WHERE carreras.id = ?";
        $stmt = $this->conexion->prepare($query);

        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->conexion->error);
        }

        $stmt->bind_param("i", $carreraId);
        $stmt->execute();
        return $stmt->get_result();
    }

    // Eliminar un piloto
    public function eliminarPiloto($id)
    {
        $queryEstadisticas = "DELETE FROM estadisticas WHERE piloto_id = ?";
        $stmtEstadisticas = $this->conexion->prepare($queryEstadisticas);
        if (!$stmtEstadisticas) {
            throw new Exception("Error al preparar la consulta de estadísticas: " . $this->conexion->error);
        }
        $stmtEstadisticas->bind_param("i", $id);
        $stmtEstadisticas->execute();
        $stmtEstadisticas->close();
    
        $query = "DELETE FROM pilotos WHERE id = ?";
        $stmt = $this->conexion->prepare($query);
    
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->conexion->error);
        }
    
        $stmt->bind_param("i", $id);
        $resultado = $stmt->execute();
    
        if (!$resultado) {
            throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
        }
    
        if ($stmt->affected_rows <= 0) {
            throw new Exception("No se pudo eliminar el piloto con ID: $id.");
        }
    
        $stmt->close();
    }
    
    

    // Obtener estadísticas de pilotos
    public function obtenerEstadisticasPilotos()
    {
        $query = "SELECT pilotos.nombre AS piloto, pilotos.apellido, estadisticas.total_puntos, estadisticas.podios
                  FROM estadisticas
                  JOIN pilotos ON estadisticas.piloto_id = pilotos.id
                  ORDER BY estadisticas.total_puntos DESC";
        $result = $this->conexion->query($query);

        if (!$result) {
            throw new Exception("Error al obtener estadísticas de pilotos: " . $this->conexion->error);
        }

        return $result;
    }

    // Cerrar la conexión al destruir el objeto
    public function __destruct()
    {
        if ($this->conexion) {
            $this->conexion->close();
        }
    }
}
?>
