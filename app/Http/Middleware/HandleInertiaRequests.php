<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = Auth::user();

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user ? $this->getUserData($user) : null,
                'permissions' =>$request->user() ? $request->user()->getUserPermissions() : [],
            ],
        ];
    }

    /**
     * Get user data for Inertia
     */
    private function getUserData($user): array
    {
        // Load relationships jika belum diload
        if (!$user->relationLoaded('roles')) {
            $user->load('roles');
        }

        if (!$user->relationLoaded('permissions')) {
            $user->load('permissions');
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name'),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ];
    }
}
