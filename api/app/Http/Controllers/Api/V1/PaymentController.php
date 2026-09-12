<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\SSLCOMMERZService;
use App\Services\MFSPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function sslcommerzIPN(Request $request)
    {
        Log::info('SSLCOMMERZ IPN Received', $request->all());

        $result = app(SSLCOMMERZService::class)->validatePayment($request->all());

        if ($result['valid']) {
            $order = Order::where('order_number', $request->input('tran_id'))->first();

            if ($order && $order->payment_status !== 'paid') {
                $order->update([
                    'payment_status' => 'paid',
                    'paid_amount'    => $result['amount'],
                    'due_amount'     => 0,
                    'transaction_id' => $result['transaction_id'],
                ]);

                $order->transitionTo('confirmed', null, 'Payment confirmed via SSLCOMMERZ');
            }
        }

        return response('IPN Received', 200);
    }

    public function sslcommerzSuccess(Request $request)
    {
        $orderNumber = $request->input('order');
        $valId       = $request->input('val_id');

        if ($valId) {
            $result = app(SSLCOMMERZService::class)->validatePayment(
                array_merge($request->all(), ['val_id' => $valId])
            );

            if ($result['valid']) {
                $order = Order::where('order_number', $orderNumber)->first();
                if ($order && $order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'paid_amount'    => $result['amount'],
                        'due_amount'     => 0,
                        'transaction_id' => $result['transaction_id'],
                    ]);
                    $order->transitionTo('confirmed', null, 'Payment verified');
                }
            }
        }

        return redirect(config('app.frontend_url') . "/order/success?order={$orderNumber}");
    }

    public function bkashCallback(Request $request)
    {
        $orderNumber = $request->input('order');
        $paymentId   = $request->input('paymentID');
        $status      = $request->input('status');

        if ($status === 'success' && $paymentId) {
            $result = app(MFSPaymentService::class)->verifyBkash($paymentId);

            if ($result['valid']) {
                $order = Order::where('order_number', $orderNumber)->first();
                if ($order) {
                    $order->update([
                        'payment_status' => 'paid',
                        'paid_amount'    => $result['amount'],
                        'due_amount'     => 0,
                        'transaction_id' => $result['transaction_id'],
                    ]);
                    $order->transitionTo('confirmed', null, 'bKash payment verified');
                }
            }
        }

        return redirect(config('app.frontend_url') . "/order/success?order={$orderNumber}");
    }

    public function paymentFailed(Request $request)
    {
        $orderNumber = $request->input('order');
        $order = Order::where('order_number', $orderNumber)->first();

        if ($order) {
            $order->update([
                'payment_status' => 'failed',
                'payment_gateway_response' => json_encode($request->all()),
            ]);
        }

        return redirect(config('app.frontend_url') . "/payment/failed?order={$orderNumber}");
    }

    public function paymentCancelled(Request $request)
    {
        $orderNumber = $request->input('order');
        $order = Order::where('order_number', $orderNumber)->first();

        if ($order) {
            $order->update([
                'payment_status' => 'pending',
                'payment_gateway_response' => json_encode($request->all()),
            ]);
        }

        return redirect(config('app.frontend_url') . "/payment/cancelled?order={$orderNumber}");
    }

    public function nagadCallback(Request $request)
    {
        $orderNumber = $request->input('orderID') ?? $request->input('order');
        $status      = $request->input('status');
        $paymentRef  = $request->input('paymentRef');

        if ($status === 'Success' && $paymentRef) {
            $order = Order::where('order_number', $orderNumber)->first();
            if ($order) {
                $verification = app(MFSPaymentService::class)->verifyNagad($orderNumber, $paymentRef);

                if ($verification['valid']) {
                    $order->update([
                        'payment_status' => 'paid',
                        'paid_amount'    => $verification['amount'] ?: $order->total,
                        'due_amount'     => 0,
                        'transaction_id' => $verification['transaction_id'],
                    ]);
                    $order->transitionTo('confirmed', null, 'Nagad payment verified');
                }
            }
        }

        return redirect(config('app.frontend_url') . "/order/success?order={$orderNumber}");
    }
}
