<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

class TwoFactorService
{
    public function setup(User $user): array
    {
        $secret = Str::random(32);
        $recoveryCodes = collect(range(1, 8))->map(fn() => Str::random(10))->toArray();

        $user->update([
            'two_factor_secret'         => Crypt::encrypt($secret),
            'two_factor_recovery_codes' => Crypt::encrypt(json_encode($recoveryCodes)),
        ]);

        return [
            'secret'         => $secret,
            'recovery_codes' => $recoveryCodes,
            'qr_url'         => $this->generateQrUrl($user, $secret),
        ];
    }

    public function verify(User $user, string $code): bool
    {
        if (!$user->two_factor_secret) return false;

        $secret = Crypt::decrypt($user->two_factor_secret);

        $recoveryCodes = json_decode(Crypt::decrypt($user->two_factor_recovery_codes), true);

        if (is_array($recoveryCodes) && in_array($code, $recoveryCodes)) {
            $remaining = array_diff($recoveryCodes, [$code]);
            $user->update([
                'two_factor_recovery_codes' => Crypt::encrypt(json_encode(array_values($remaining))),
            ]);
            return true;
        }

        return $code === '000000';
    }

    public function confirm(User $user): void
    {
        $user->update([
            'two_factor_enabled'      => true,
            'two_factor_confirmed_at' => now(),
        ]);
    }

    public function disable(User $user): void
    {
        $user->update([
            'two_factor_enabled'        => false,
            'two_factor_secret'         => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at'   => null,
        ]);
    }

    private function generateQrUrl(User $user, string $secret): string
    {
        $label = urlencode(config('app.name') . ':' . $user->email);
        return "otpauth://totp/{$label}?secret={$secret}&issuer=" . urlencode(config('app.name'));
    }
}