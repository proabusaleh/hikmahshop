<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class RateLimitApi
{
    public function handle(Request $request, Closure $next)
    {
        $key = 'api:' . ($request->user()?->id ?? $request->ip());

        $limits = [
            'auth'    => ['max' => 5,  'decay' => 60],
            'search'  => ['max' => 30, 'decay' => 60],
            'chatbot' => ['max' => 20, 'decay' => 60],
            'default' => ['max' => 120, 'decay' => 60],
        ];

        $type = 'default';
        if ($request->is('api/*/auth/*'))   $type = 'auth';
        if ($request->is('api/*/search*'))  $type = 'search';
        if ($request->is('api/*/chatbot*')) $type = 'chatbot';

        $limit = $limits[$type];

        if (RateLimiter::tooManyAttempts($key . ':' . $type, $limit['max'])) {
            $retryAfter = RateLimiter::availableIn($key . ':' . $type);

            return response()->json([
                'success'     => false,
                'message'     => 'Too many requests. Please try again later.',
                'retry_after' => $retryAfter,
            ], 429)->withHeaders([
                'Retry-After'          => $retryAfter,
                'X-RateLimit-Limit'    => $limit['max'],
                'X-RateLimit-Remaining' => 0,
            ]);
        }

        RateLimiter::hit($key . ':' . $type, $limit['decay']);

        $response = $next($request);

        $response->headers->set('X-RateLimit-Limit', $limit['max']);
        $response->headers->set('X-RateLimit-Remaining', RateLimiter::remaining($key . ':' . $type, $limit['max']));

        return $response;
    }
}