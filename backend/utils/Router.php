<?php

declare(strict_types=1);

class Router
{
    private array $routes = [];

    private string $method;
    private string $uri;

    public function __construct(string $method, string $uri)
    {
        $this->method = $method;
        $this->uri = $uri;
    }

    public function register(string $route, string $method, callable $callback): void
    {
        $method = strtoupper($method);
        $this->routes[$method][$route] = $callback;
    }

    public function dispatch(): void
    {
        $method = strtoupper($this->method);
        $uri = rtrim($this->uri, '/') ?: '/';

        if (!isset($this->routes[$method])) {
            Response::error('Method not allowed', 405);
            return;
        }

        if (!isset($this->routes[$method][$uri])) {
            Response::error('Route not found', 404);
            return;
        }

        call_user_func($this->routes[$method][$uri]);
    }
}
