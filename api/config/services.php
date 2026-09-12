<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'sslcommerz' => [
        'store_id'       => env('SSLCOMMERZ_STORE_ID', 'your_store_id'),
        'store_password' => env('SSLCOMMERZ_STORE_PASSWORD', 'your_password'),
        'sandbox'        => env('SSLCOMMERZ_SANDBOX', true),
    ],

    'bkash' => [
        'base_url'   => env('BKASH_BASE_URL', 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout'),
        'app_key'    => env('BKASH_APP_KEY'),
        'app_secret' => env('BKASH_APP_SECRET'),
        'username'   => env('BKASH_USERNAME'),
        'password'   => env('BKASH_PASSWORD'),
    ],

    'nagad' => [
        'base_url'     => env('NAGAD_BASE_URL', 'https://sandbox.mynagad.com:10060'),
        'merchant_id'  => env('NAGAD_MERCHANT_ID'),
        'private_key'  => env('NAGAD_PRIVATE_KEY'),
        'public_key'   => env('NAGAD_PUBLIC_KEY'),
    ],

];
