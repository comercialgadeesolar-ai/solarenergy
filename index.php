<?php
// Standalone PHP demo. In WordPress, activate orbita-solar.php as a plugin instead.
?><!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#070c13">
    <meta name="description" content="Explore o Sol e os planetas em 3D, entenda a energia fotovoltaica e simule sua economia.">
    <title>Órbita Solar — O futuro vem do Sol</title>
    <link rel="icon" href="public/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="dist/orbita-solar.css">
</head>
<body class="orbita-solar" id="orbita-solar">
    <div id="app"><?php include __DIR__ . '/templates/landing.html'; ?></div>
    <?php include __DIR__ . '/templates/floating-menu.html'; ?>
    <script type="module" src="dist/orbita-solar.js"></script>
</body>
</html>
