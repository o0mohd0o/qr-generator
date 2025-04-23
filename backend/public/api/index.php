<?php
// Get the requested URI
$uri = $_SERVER['REQUEST_URI'];
// Extract the part after /qr-code/api/
$path = preg_replace('/^\/qr-code\/api\//', '', $uri);
// Redirect to the working URL
header("Location: /qr-code/backend/public/api/" . $path);
exit;