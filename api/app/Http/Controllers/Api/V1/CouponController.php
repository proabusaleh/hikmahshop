<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validate(Request $request)
    {
        $validated = $request->validate([
            'code'         => 'required|string',
            'order_amount' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper($validated['code']))->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coupon code',
            ], 404);
        }

        $validation = $coupon->isValid($request->user(), $validated['order_amount']);

        if (!$validation['valid']) {
            return response()->json([
                'success' => false,
                'message' => $validation['message'],
            ], 422);
        }

        $discount = $coupon->calculateDiscount($validated['order_amount']);

        return response()->json([
            'success' => true,
            'data'    => [
                'code'        => $coupon->code,
                'type'        => $coupon->type,
                'value'       => (float) $coupon->value,
                'discount'    => $discount,
                'description' => $coupon->description,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'             => 'required|string|unique:coupons,code|max:50',
            'description'      => 'nullable|string',
            'type'             => 'in:percentage,fixed',
            'value'            => 'required|numeric|min:0',
            'min_order_amount' => 'numeric|min:0',
            'max_discount'     => 'nullable|numeric|min:0',
            'usage_limit'      => 'nullable|integer|min:1',
            'per_user_limit'   => 'integer|min:1',
            'starts_at'        => 'nullable|date',
            'expires_at'       => 'nullable|date|after:starts_at',
            'is_active'        => 'boolean',
        ]);

        return response()->json([
            'success' => true,
            'data'    => Coupon::create($validated),
        ], 201);
    }
}
