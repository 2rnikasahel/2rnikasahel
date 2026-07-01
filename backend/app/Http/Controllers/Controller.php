<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller extends \Illuminate\Routing\Controller
{
    protected function success($data = null, $message = 'عملیات با موفقیت انجام شد', $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error($message = 'خطا در انجام عملیات', $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    protected function validationError($errors): JsonResponse
    {
        return $this->error('اطلاعات وارد شده معتبر نیست', 422, $errors);
    }
}
