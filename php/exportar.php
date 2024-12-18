<?php
require_once 'F1Manager.php';

$f1 = new F1Manager();
$f1->exportarCSV('pilotos', 'pilotos_exportados.csv');

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="pilotos_exportados.csv"');
readfile('pilotos_exportados.csv');
exit;
?>
