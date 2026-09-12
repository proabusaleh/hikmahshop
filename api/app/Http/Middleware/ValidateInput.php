<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ValidateInput
{
    public function handle(Request $request, Closure $next)
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value) {
            if (is_string($value)) {
                $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

                $patterns = [
                    '/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)/i',
                    '/(--|#|\/\*)/',
                    '/(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i',
                ];

                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        abort(400, 'Invalid input detected');
                    }
                }
            }
        });

        $request->merge($input);

        return $next($request);
    }
}