<?php

namespace App\Services\SMS;

interface SMSSenderInterface
{
    public function send(string $to, string $message): bool;
}
