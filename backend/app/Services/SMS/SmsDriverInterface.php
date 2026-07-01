<?php

namespace App\Services\SMS;

interface SmsDriverInterface
{
    /**
     * Send an SMS message.
     *
     * @param string $to Recipient phone number
     * @param string $message Message content
     * @return bool Success status
     */
    public function send(string $to, string $message): bool;

    /**
     * Check account balance (optional but recommended for monitoring).
     *
     * @return float
     */
    public function getBalance(): float;
}
