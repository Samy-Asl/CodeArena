<?php

declare(strict_types=1);

class TestController
{
    public function test(): void
    {
        Response::success([
            'message' => 'API working',
        ]);
    }

    public function ping(): void
    {
        Response::success([
            'message' => 'pong',
        ]);
    }
}
