<?php
namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:roles index', only: ['index']),
            new Middleware('permission:roles create', only: ['create', 'store']),
            new Middleware('permission:roles edit', only: ['edit', 'update']),
            new Middleware('permission:roles delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $roles = Role::select('id', 'name')
                ->with('permissions:id,name')
                ->when($request->search, fn($search) => $search->Where('name', 'like', '%'.$request->search.'%'))
                ->latest()
                ->paginate(6);

        return inertia('Roles/Index', ['roles' => $roles, 'filters' => $request->only(['search'])]);
    }


    public function create()
    {
        // ✅ PERBAIKAN: Gunakan method private yang sudah ada
        $permissions = $this->getGroupedPermissions();


        return inertia('Roles/Create', ['permissions' => $permissions]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|max:255|unique:roles',
            'selectedPermissions' => 'required|array|min:1',
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);
        $role->givePermissionTo($request->selectedPermissions);

        return to_route('roles.index');
    }



    public function edit(Role $role)
    {
        $permissions = $this->getGroupedPermissions();

        // Pastikan permissions di-load dengan benar
        $role->load('permissions:id,name');

        // Debug data yang dikirim ke frontend
        logger('Edit Role Data:', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'permissions_count' => $role->permissions->count(),
            'permissions' => $role->permissions->pluck('name')->toArray()
        ]);

        return inertia('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

   public function update(Request $request, Role $role)
{
    // Debug data yang masuk
    logger('Update Role Request Data:', [
        'name' => $request->name,
        'selectedPermissions' => $request->selectedPermissions,
        'selectedPermissions_count' => is_array($request->selectedPermissions) ? count($request->selectedPermissions) : 0,
        'role_id' => $role->id
    ]);

    $request->validate([
        'name' => 'required|min:3|max:255|unique:roles,name,'.$role->id,
        'selectedPermissions' => 'required|array|min:1',
    ]);

    $role->update(['name' => $request->name]);
    $role->syncPermissions($request->selectedPermissions);

    // Debug setelah update
    logger('Role updated successfully. New permissions:', [
        'permissions' => $role->permissions->pluck('name')->toArray()
    ]);

    return to_route('roles.index');
}

    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return back();
    }

    /**
     * ✅ Private method untuk mengelompokkan permissions berdasarkan prefix
     * Digunakan oleh create() dan edit() untuk konsistensi dan menghindari code duplikat
     */
    private function getGroupedPermissions(): array
    {
        return Permission::orderBy('name')
            ->get()
            ->groupBy(function ($permission) {
                return explode(' ', $permission->name)[0];
            })
            ->map(function ($group) {
                return $group->pluck('name')->values()->toArray(); // ✅ Tambah ->toArray()
            })
            ->toArray();
    }
}
