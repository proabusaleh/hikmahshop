<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'phone'    => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'] ?? null,
            'password' => $validated['password'],
        ]);

        $user->assignRole('customer');

        $token = $user->createToken('hikmahshop-app')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data'    => [
                'user'  => $user,
                'token' => $token,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            LoginHistory::create([
                'user_id'        => $user?->id,
                'status'         => 'failed',
                'ip_address'     => $request->ip(),
                'user_agent'     => $request->userAgent(),
                'browser'        => $this->parseBrowser($request->userAgent()),
                'os'             => $this->parseOS($request->userAgent()),
                'failure_reason' => 'Invalid credentials',
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        if ($user->status === 'inactive') {
            return response()->json([
                'success' => false,
                'message' => 'Account is deactivated',
            ], 403);
        }

        // Record login history
        LoginHistory::create([
            'user_id'    => $user->id,
            'status'     => 'success',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'browser'    => $this->parseBrowser($request->userAgent()),
            'os'         => $this->parseOS($request->userAgent()),
        ]);

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Check 2FA
        if ($user->two_factor_enabled) {
            return response()->json([
                'success'      => true,
                'requires_2fa' => true,
                'temp_token'   => $user->createToken('2fa-pending')->plainTextToken,
            ]);
        }

        $token = $user->createToken('hikmahshop-app')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => [
                'user'  => $user->load('roles'),
                'token' => $token,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user()->load('roles'),
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink([
            'email' => $validated['email'],
        ]);

        return $status === Password::RESET_LINK_SENT
            ? response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email',
            ])
            : response()->json([
                'success' => false,
                'message' => 'We could not find a user with that email address',
            ], 400);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()],
        ]);

        $status = Password::reset(
            $validated,
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
            ])
            : response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token',
            ], 400);
    }

    private function parseBrowser(?string $ua): string
    {
        if (!$ua) return 'Unknown';
        if (str_contains($ua, 'Chrome'))  return 'Chrome';
        if (str_contains($ua, 'Firefox')) return 'Firefox';
        if (str_contains($ua, 'Safari'))  return 'Safari';
        if (str_contains($ua, 'Edge'))    return 'Edge';
        return 'Other';
    }

    private function parseOS(?string $ua): string
    {
        if (!$ua) return 'Unknown';
        if (str_contains($ua, 'Windows')) return 'Windows';
        if (str_contains($ua, 'Mac'))     return 'macOS';
        if (str_contains($ua, 'Linux'))   return 'Linux';
        if (str_contains($ua, 'Android')) return 'Android';
        if (str_contains($ua, 'iPhone'))  return 'iOS';
        return 'Other';
    }
}
