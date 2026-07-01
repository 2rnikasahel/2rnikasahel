<?php

namespace App\Services\Email;

use Illuminate\Support\Facades\Mail;

class EmailService
{
    public function send(string $to, string $subject, string $view, array $data = []): bool
    {
        try {
            Mail::send($view, $data, function ($message) use ($to, $subject) {
                $message->to($to)
                    ->subject($subject)
                    ->from(config('mail.from.address'), config('app.name'));
            });

            return true;
        } catch (\Exception $e) {
            logger()->error('Email Error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendRaw(string $to, string $subject, string $body): bool
    {
        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)
                    ->subject($subject)
                    ->from(config('mail.from.address'), config('app.name'));
            });
            return true;
        } catch (\Exception $e) {
            logger()->error('Email Error: ' . $e->getMessage());
            return false;
        }
    }
}
