<?php

namespace App\Services\SMS\Drivers;

use App\Services\SMS\SMSSenderInterface;
use Illuminate\Support\Facades\Http;

class KavenegarDriver implements SMSSenderInterface
{
    public function send(string $to, string $message): bool
    {
        try {
            $apiKey = config('services.sms.kavenegar.api_key');
            $sender = config('services.sms.kavenegar.sender');

            $response = Http::post("https://api.kavenegar.com/v1/{$apiKey}/sms/send.json", [
                'receptor' => $to,
                'message' => $message,
                'sender' => $sender,
            ]);

            $result = $response->json();
            
            return isset($result['return']['status']) && $result['return']['status'] == 200;
        } catch (\Exception $e) {
            logger()->error('Kavenegar SMS Error: ' . $e->getMessage());
            return false;
        }
    }
}
