<?php

declare(strict_types=1);

class Response
{
    public static function success($data = null, int $code = 200): void
    {
        http_response_code($code);

        echo json_encode([
            'success' => true,
            'data' => $data,
            'error' => null,
        ]);
    }

    public static function error(string $message, int $code = 400): void
    {
        http_response_code($code);

        echo json_encode([
            'success' => false,
            'data' => null,
            'error' => $message,
        ]);
    }
}
