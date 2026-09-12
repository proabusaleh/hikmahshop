<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SSLCOMMERZService
{
    private string $storeId;
    private string $storePassword;
    private string $baseUrl;
    private bool $sandbox;

    public function __construct()
    {
        $this->sandbox       = config('services.sslcommerz.sandbox', true);
        $this->storeId       = config('services.sslcommerz.store_id');
        $this->storePassword = config('services.sslcommerz.store_password');
        $this->baseUrl       = $this->sandbox
            ? 'https://sandbox.sslcommerz.com'
            : 'https://securepay.sslcommerz.com';
    }

    public function createSession(Order $order, array $customerInfo): array
    {
        $postData = [
            'store_id'       => $this->storeId,
            'store_passwd'   => $this->storePassword,
            'total_amount'   => (float) $order->total,
            'currency'       => 'BDT',
            'tran_id'        => $order->order_number,
            'success_url'    => config('app.url') . '/api/v1/payment/sslcommerz/success?order=' . $order->order_number,
            'fail_url'       => config('app.url') . '/api/v1/payment/failed?order=' . $order->order_number,
            'cancel_url'     => config('app.url') . '/api/v1/payment/cancelled?order=' . $order->order_number,
            'ipn_url'        => config('app.url') . '/api/v1/payment/sslcommerz/ipn',
            'cus_name'       => $customerInfo['name'],
            'cus_email'      => $customerInfo['email'],
            'cus_add1'       => $customerInfo['address'],
            'cus_city'       => $customerInfo['city'],
            'cus_postcode'   => $customerInfo['zip'] ?? '1200',
            'cus_country'    => 'Bangladesh',
            'cus_phone'      => $customerInfo['phone'],
            'shipping_method' => 'YES',
            'ship_name'      => $customerInfo['name'],
            'ship_add1'      => $customerInfo['address'],
            'ship_city'      => $customerInfo['city'],
            'ship_postcode'  => $customerInfo['zip'] ?? '1200',
            'ship_country'   => 'Bangladesh',
            'num_of_item'    => $order->items->count(),
            'product_name'   => 'HikmahShop Order #' . $order->order_number,
            'product_category' => 'Mixed',
            'product_profile'  => 'general',
        ];

        try {
            $response = Http::asForm()
                ->timeout(30)
                ->post("{$this->baseUrl}/gwprocess/v4/api.php?Q=pay", $postData);

            $result = $response->json();

            if ($result['status'] === 'SUCCESS') {
                $order->update([
                    'payment_gateway_response' => json_encode([
                        'sessionkey'     => $result['sessionkey'],
                        'GatewayPageURL' => $result['GatewayPageURL'],
                    ]),
                ]);

                return [
                    'success'     => true,
                    'session_key' => $result['sessionkey'],
                    'gateway_url' => $result['GatewayPageURL'],
                ];
            }

            Log::error('SSLCOMMERZ session creation failed', $result);
            return ['success' => false, 'message' => $result['failedreason'] ?? 'Session creation failed'];

        } catch (\Exception $e) {
            Log::error('SSLCOMMERZ Exception', ['error' => $e->getMessage()]);
            return ['success' => false, 'message' => 'Payment gateway unreachable'];
        }
    }

    public function validatePayment(array $ipnData): array
    {
        $tranId     = $ipnData['tran_id'] ?? '';
        $amount     = $ipnData['amount'] ?? 0;
        $currency   = $ipnData['currency'] ?? 'BDT';
        $status     = $ipnData['status'] ?? '';
        $valId      = $ipnData['val_id'] ?? '';

        if ($status !== 'VALID' && $status !== 'VALIDATED') {
            return ['valid' => false, 'message' => "Transaction status: {$status}"];
        }

        $validationUrl = "{$this->baseUrl}/validator/api/validationserverAPI.php"
            . "?val_id={$valId}"
            . "&store_id={$this->storeId}"
            . "&store_passwd={$this->storePassword}"
            . "&format=json";

        try {
            $response = Http::timeout(15)->get($validationUrl);
            $validation = $response->json();

            if ($validation['status'] !== 'VALID' && $validation['status'] !== 'VALIDATED') {
                Log::warning('SSLCOMMERZ validation failed', $validation);
                return ['valid' => false, 'message' => 'API validation failed'];
            }

            $order = Order::where('order_number', $tranId)->first();
            if (!$order) {
                return ['valid' => false, 'message' => 'Order not found'];
            }

            if (abs((float) $validation['amount'] - (float) $order->total) > 0.01) {
                Log::error('SSLCOMMERZ amount mismatch', [
                    'expected' => $order->total,
                    'received' => $validation['amount'],
                ]);
                return ['valid' => false, 'message' => 'Amount mismatch'];
            }

            if ($validation['currency_type'] !== $currency) {
                return ['valid' => false, 'message' => 'Currency mismatch'];
            }

            return [
                'valid'          => true,
                'transaction_id' => $validation['bank_tran_id'] ?? $valId,
                'card_type'      => $validation['card_type'] ?? null,
                'card_brand'     => $validation['card_brand'] ?? null,
                'amount'         => (float) $validation['amount'],
            ];

        } catch (\Exception $e) {
            Log::error('SSLCOMMERZ validation exception', ['error' => $e->getMessage()]);
            return ['valid' => false, 'message' => 'Validation service error'];
        }
    }
}
