<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'دسترسی غیرمجاز - فقط سوپر ادمین',
            ], 403);
        }

        return $next($request);
    }
}
