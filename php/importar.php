<?php
require_once 'F1Manager.php';

if ($_FILES['archivo']['tmp_name']) {
    $archivo = $_FILES['archivo']['tmp_name'];
    $f1 = new F1Manager();
    $f1->importarCSV($archivo, 'pilotos');
    echo "Datos importados correctamente.";
}
?>
<a href="f1.php">Volver</a>
