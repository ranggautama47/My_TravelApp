<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | Tentukan endpoint mana saja yang boleh diakses dari luar (frontend).
    | Termasuk endpoint API, Sanctum (csrf-cookie), dan webhook Xendit.
    |
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'user',
        'payment/*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Tentukan metode HTTP apa saja yang diizinkan. Biasanya gunakan ['*']
    | agar semua metode diizinkan (GET, POST, PUT, DELETE, dll).
    |
    */

    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Domain frontend yang diizinkan melakukan request ke backend Laravel.
    | Ganti URL di bawah sesuai domain frontend kamu.
    |
    */

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://localhost:3000',
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins Patterns
    |--------------------------------------------------------------------------
    */

    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Header yang diizinkan dalam permintaan HTTP.
    |
    */

    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Header yang diizinkan terlihat oleh browser di response.
    |
    */

    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | Berapa lama hasil preflight request disimpan oleh browser (detik).
    |
    */

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Aktifkan ini agar Sanctum bisa mengirim cookie sesi (important untuk SPA).
    |
    */

    'supports_credentials' => false,
];
