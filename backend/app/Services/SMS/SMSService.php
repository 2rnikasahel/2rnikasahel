<?php

namespace App\Services\SMS;

class SMSService
{
    private SMSSenderInterface $driver;

    public function __construct()
    {
        $driver = config('services.sms.driver', 'kavenegar');
        $class = "App\\Services\\SMS\\Drivers\\" . ucfirst($driver) . 'Driver';
        
        if (!class_exists($class)) {
            throw new \Exception("SMS Driver {$driver} not found");
        }

        $this->driver = new $class();
    }

    public function send(string $to, string $message): bool
    {
        return $this->driver->send($to, $message);
    }
}
