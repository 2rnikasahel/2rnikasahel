<?php

namespace App\Services\Email;

interface EmailDriverInterface
{
    /**
     * Send an email.
     *
     * @param string $to Recipient email
     * @param string $subject Email subject
     * @param string $body Email body (HTML or Text)
     * @param array $attachments Array of file paths
     * @return bool Success status
     */
    public function send(string $to, string $subject, string $body, array $attachments = []): bool;
}
