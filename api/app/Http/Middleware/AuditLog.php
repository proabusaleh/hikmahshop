<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditLog
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }

    public function terminate(Request $request, $response): void
    {
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return;
        }

        $skip = ['api/v1/auth/login', 'api/v1/auth/register'];
        if (in_array($request->path(), $skip)) return;

        $user = $request->user();

        try {
            DB::table('audit_logs')->insert([
                'user_id'     => $user?->id,
                'action'      => strtolower($request->method()),
                'ip_address'  => $request->ip(),
                'user_agent'  => substr($request->userAgent() ?? '', 0, 255),
                'description' => "{$request->method()} {$request->path()}",
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Audit log failed', ['error' => $e->getMessage()]);
        }
    }
}