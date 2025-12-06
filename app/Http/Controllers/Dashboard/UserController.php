<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:users index', only: ['index']),
            new Middleware('permission:users create', only: ['create', 'store']),
            new Middleware('permission:users edit', only: ['edit', 'update']),
            new Middleware('permission:users delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $users = User::with('roles')
            ->when($request->search, fn($query) =>
                $query->where('name', 'like', "%{$request->search}%"))
            ->orderBy('id', 'ASC')
            ->paginate(6);

        return inertia('Users/Index', [
            'users' => $users,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $roles = Role::latest()->get();
        return inertia('Users/Create', ['roles' => $roles]);
    }

    // ✅ Gabungan store()
    public function store(UserStoreRequest $request)
    {

        $validated = $request->validated();
        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? '-',
            'password' => bcrypt($validated['password']),
        ]);

        $user->assignRole($validated['selectedRoles']);

        return to_route('users.index')->with('success', 'User berhasil dibuat!');
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $user->load('roles');

        return inertia('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    // ✅ Gabungan update()
    public function update(UserUpdateRequest $request, User $user)
    {
        $validated = $request->validated();
        // update user data
        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? '-',
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        $user->update($updateData);
        $user->syncRoles($validated['selectedRoles']);

        return to_route('users.index')->with('success', 'User berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'User berhasil dihapus.');
    }
}
