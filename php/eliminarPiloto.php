<?php
// Incluir el archivo que contiene la clase F1Manager
require_once 'F1Manager.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar que el ID esté presente en la solicitud y sea un número válido
    if (isset($_POST['id']) && is_numeric($_POST['id'])) {
        $idPiloto = intval($_POST['id']); 

        try {
            // Instanciar la clase F1Manager
            $f1Manager = new F1Manager();

            // Llamar al método eliminarPiloto
            $f1Manager->eliminarPiloto($idPiloto);

            // Redirigir al usuario después de eliminar
            header('Location: f1.php?mensaje=Piloto eliminado exitosamente');
            exit();
        } catch (Exception $e) {
            // Manejo de errores
            echo "Error: " . $e->getMessage();
        }
    } else {
        echo "ID de piloto inválido.";
    }
} else {
    echo "Método no permitido.";
}
?>
