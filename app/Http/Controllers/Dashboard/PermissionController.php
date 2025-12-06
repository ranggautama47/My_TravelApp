<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:permissions index', only: ['index']),
            new Middleware('permission:permissions create', only: ['create', 'store']),
            new Middleware('permission:permissions edit', only: ['edit', 'update']),
            new Middleware('permission:permissions delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $permissions = Permission::select('id', 'name')
            ->when($request->search, fn($query) => $query->where('name', 'like', '%'.$request->search.'%'))
            ->latest()
            ->paginate(6)->withQueryString();

        return inertia('Permissions/Index', [
            'permissions' => $permissions,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        return inertia('Permissions/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|max:255|unique:permissions'
        ]);

        Permission::create(['name' => $request->name]);

        return to_route('permissions.index')
            ->with('success', 'Permission created successfully!'); // ✅ TAMBAHKAN
    }

    public function edit(Permission $permission)
    {
        return inertia('Permissions/Edit', ['permission' => $permission]);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|min:3|max:255|unique:permissions,name,'.$permission->id
        ]);

        $permission->update(['name' => $request->name]);

        return to_route('permissions.index')
            ->with('success', 'Permission updated successfully!'); // ✅ TAMBAHKAN
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back()
            ->with('success', 'Permission deleted successfully!'); // ✅ TAMBAHKAN
    }
}
