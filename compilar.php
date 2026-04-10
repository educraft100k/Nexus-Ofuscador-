<?php

$pluginPath = __DIR__ . "/MiPlugin";
$outputPath = __DIR__ . "/MiPlugin.phar";

if(!is_dir($pluginPath)) {
    echo "Error: No se encontro la carpeta MiPlugin\n";
    exit(1);
}

if(file_exists($outputPath)) {
    unlink($outputPath);
    echo "Eliminando phar anterior...\n";
}

echo "Compilando plugin...\n";

$phar = new Phar($outputPath);
$phar->startBuffering();
$phar->setStub('<?php __HALT_COMPILER();');
$phar->buildFromDirectory($pluginPath);
$phar->compressFiles(Phar::GZ);
$phar->stopBuffering();

echo "Listo! Creado: MiPlugin.phar\n";
echo "Tamaño: " . round(filesize($outputPath) / 1024, 2) . " KB\n";
