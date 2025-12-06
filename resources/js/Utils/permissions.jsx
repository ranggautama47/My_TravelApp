export default function hasAnyPermission(user, requiredPermissions) {
    if (!user || !requiredPermissions || requiredPermissions.length === 0) {
        return false;
    }


    const userPermissions = new Set(user.permissions || []);

    if (user.userPermissions && Array.isArray(user.permissions)) {
        user.permissions.forEach((p) => userPermissions.add(p.name));
    }

    if (user.roles && Array.isArray(user.roles)) {
        user.roles.forEach((role) => {
            if (role.permissions && Array.isArray(role.permissions)) {
                role.permissions.forEach((p) => userPermissions.add(p.name));
            }
        });
    }

    if (userPermissions.size === 0) {
        return false;
    }
    return requiredPermissions.some((permission) =>
        userPermissions.has(permission)
    );
}
