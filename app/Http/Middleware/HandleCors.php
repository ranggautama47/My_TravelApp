<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class HandleCors
{
    /**
     * Menangani request CORS.
     *
     * @param  \Closure (\Illuminate\Http\Request):  (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Tambahkan header tambahan jika diperlukan
        $response->headers->set('Access-Control-Allow-Origin',  '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-with, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials',  'true');
        $response->headers->set('Access-Control-Allow-Private-Network',  'true');
         return $response;
    }
}
