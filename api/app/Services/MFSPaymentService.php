<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MFSPaymentService
{
    public function initiateBkash(Order $order): array
    {
        $token = $this->getBkashToken();
        if (!$token) return ['success' => false, 'message' => 'bKash auth failed'];

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
                'X-APP-Key'     => config('services.bkash.app_key'),
                'Content-Type'  => 'application/json',
            ])->post(config('services.bkash.base_url') . '/checkout/create', [
                'mode'                  => '0011',
                'payerReference'        => 'HS-' . $order->user_id,
                'callbackURL'           => config('app.url') . '/api/v1/payment/bkash/callback?order=' . $order->order_number,
                'amount'                => (float) $order->total,
                'currency'              => 'BDT',
                'intent'                => 'sale',
                'merchantInvoiceNumber' => $order->order_number,
            ]);

            $result = $response->json();

            if ($result['statusCode'] === '0000') {
                return [
                    'success'    => true,
                    'payment_id' => $result['paymentID'],
                    'bkash_url'  => $result['bkashURL'],
                ];
            }

            return ['success' => false, 'message' => $result['statusMessage'] ?? 'bKash error'];
        } catch (\Exception $e) {
            Log::error('bKash Error', ['error' => $e->getMessage()]);
            return ['success' => false, 'message' => 'bKash service unavailable'];
        }
    }

    public function verifyBkash(string $paymentId): array
    {
        $token = $this->getBkashToken();

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
                'X-APP-Key'     => config('services.bkash.app_key'),
            ])->post(config('services.bkash.base_url') . '/checkout/execute', [
                'paymentID' => $paymentId,
            ]);

            $result = $response->json();

            if ($result['statusCode'] === '0000') {
                return [
                    'valid'          => true,
                    'transaction_id' => $result['trxID'],
                    'amount'         => (float) $result['amount'],
                ];
            }

            return ['valid' => false, 'message' => $result['statusMessage']];
        } catch (\Exception $e) {
            return ['valid' => false, 'message' => 'Verification failed'];
        }
    }

    public function initiateNagad(Order $order): array
    {
        try {
            $callbackUrl = config('app.url') . '/api/v1/payment/nagad/callback?order=' . $order->order_number;

            $response = Http::post(config('services.nagad.base_url') . '/api/dfs/check-out/initialize/' . config('services.nagad.merchant_id'), [
                'merchantCallbackURL' => $callbackUrl,
                'orderID'             => $order->order_number,
                'amount'              => (float) $order->total,
                'currencyCode'        => '050',
                'challenge'           => hash('sha256', $order->order_number . time()),
            ]);

            $result = $response->json();

            if (isset($result['callBackUrl'])) {
                return [
                    'success'   => true,
                    'nagad_url' => $result['callBackUrl'],
                ];
            }

            return ['success' => false, 'message' => 'Nagad initialization failed'];
        } catch (\Exception $e) {
            Log::error('Nagad Error', ['error' => $e->getMessage()]);
            return ['success' => false, 'message' => 'Nagad service unavailable'];
        }
    }

    private function getBkashToken(): ?string
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'username'     => config('services.bkash.username'),
                'password'     => config('services.bkash.password'),
            ])->post(config('services.bkash.base_url') . '/tokenized/checkout/token/grant', [
                'app_key'    => config('services.bkash.app_key'),
                'app_secret' => config('services.bkash.app_secret'),
            ]);

            return $response->json()['id_token'] ?? null;
        } catch (\Exception $e) {
            Log::error('bKash Token Error', ['error' => $e->getMessage()]);
            return null;
        }
    }

    public function verifyNagad(string $orderId, string $paymentRef): array
    {
        try {
            $response = Http::post(config('services.nagad.base_url') . '/api/dfs/check-out/payment/validate/' . config('services.nagad.merchant_id'), [
                'orderID'   => $orderId,
                'paymentRef' => $paymentRef,
            ]);

            $result = $response->json();

            if (($result['statusCode'] ?? '') === '0000' || ($result['status'] ?? '') === 'Success') {
                return [
                    'valid'          => true,
                    'transaction_id' => $paymentRef,
                    'amount'         => (float) ($result['amount'] ?? 0),
                ];
            }

            return ['valid' => false, 'message' => $result['statusMessage'] ?? $result['message'] ?? 'Nagad validation failed'];
        } catch (\Exception $e) {
            Log::error('Nagad Validation Error', ['error' => $e->getMessage()]);
            return ['valid' => false, 'message' => 'Nagad service unavailable'];
        }
    }
}
