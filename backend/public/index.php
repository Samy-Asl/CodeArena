<?php

declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Router.php';
require_once __DIR__ . '/../controllers/TestController.php';

$config = require __DIR__ . '/../config/app.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

    $router = new Router($method, $uri);

    require __DIR__ . '/../routes/api.php';

    $router->dispatch();
} catch (Throwable $exception) {
    $message = $config['debug'] ? $exception->getMessage() : 'Internal server error';

    Response::error($message, 500);
}
