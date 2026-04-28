<?php

declare(strict_types=1);

$controller = new TestController();

$router->register('/api/test', 'GET', [$controller, 'test']);
$router->register('/api/ping', 'GET', [$controller, 'ping']);
