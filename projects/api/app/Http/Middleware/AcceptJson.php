<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AcceptJson
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $accept = $request->header('Accept');

        if (!Str::contains($accept, 'application/json')) {
            return new JsonResponse([
                'status' => false,
                'data' => null,
                'errors' => [
                    'Accept header is incorrect',
                    $accept
                ],
                'message' => 'Fail'
            ],
                options: JSON_PRETTY_PRINT,
            );
        }

        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', '*')
            ->header('Access-Control-Allow-Credentials', true)
            ->header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,X-Token-Auth,Authorization')
            ->header('Accept', 'application/json');
    }
}
