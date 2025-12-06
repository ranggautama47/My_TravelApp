import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Checkbox from "@/Components/Checkbox";
import Swal from "sweetalert2";

export default function Edit({ auth }) {
    const { permissions, role } = usePage().props;

    console.log("=== INITIAL ROLE DATA ===");
    console.log("Role:", role);
    console.log("Role permissions:", role?.permissions?.map(p => p.name));

    const { data, setData, put, errors, processing } = useForm({
        name: role?.name || "",
        selectedPermissions: Array.isArray(role?.permissions)
            ? role.permissions.map((p) => p.name)
            : [],
    });

    // Pastikan initial data ter-set dengan benar
    useEffect(() => {
        if (role?.permissions && Array.isArray(role.permissions)) {
            const initialPermissions = role.permissions.map((p) => p.name);
            console.log("Setting initial permissions:", initialPermissions);
            setData("selectedPermissions", initialPermissions);
        }
    }, [role]);

    const safeSelectedPermissions = Array.isArray(data.selectedPermissions)
        ? data.selectedPermissions
        : [];

    useEffect(() => {
        console.log("=== CURRENT SELECTED PERMISSIONS ===", safeSelectedPermissions);
    }, [safeSelectedPermissions]);

    // ✅ SOLUSI 3: Simple Checkbox Handler
    const handleCheckboxChange = (permissionName, isChecked) => {
    console.log("Checkbox changed:", permissionName, isChecked);

    const current = Array.isArray(data.selectedPermissions)
        ? [...data.selectedPermissions]
        : [];

    let updated;

    if (isChecked) {
        if (!current.includes(permissionName)) {
            updated = [...current, permissionName];
        } else {
            updated = current;
        }
    } else {
        updated = current.filter((p) => p !== permissionName);
    }

    console.log("✅ Updated permissions:", updated);

    setData("selectedPermissions", updated);
};


    const handleUpdateData = async (e) => {
        e.preventDefault();

        console.log("=== SUBMITTING DATA ===");
        console.log("Name:", data.name);
        console.log("Permissions:", safeSelectedPermissions);

        if (safeSelectedPermissions.length === 0) {
            Swal.fire({
                title: "Error!",
                text: "Please select at least one permission",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        put(route("roles.update", role.id), {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Data updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onError: (errors) => {
                console.log("Backend errors:", errors);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update data. Please check the form.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Role
                </h2>
            }
        >
            <Head title={"Edit Role"} />
            <Container>
                <Card title={"Edit Role"}>
                    {/* Debug Section */}
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-800">
                            <strong>Debug Info:</strong> Selected {safeSelectedPermissions.length} permissions
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            {safeSelectedPermissions.length > 0
                                ? safeSelectedPermissions.join(', ')
                                : 'No permissions selected'}
                        </p>
                    </div>

                    <form onSubmit={handleUpdateData}>
                        <div className="mb-4">
                            <Input
                                label={"Role Name"}
                                type={"text"}
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                errors={errors.name}
                                placeholder="Input role name.."
                            />
                        </div>

                        <div className="mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(permissions).map(([group, permissionItem], i) => (
                                    <div key={`group-${group}-${i}`} className="p-4 bg-white rounded-lg shadow-md">
                                        <h3 className="font-bold text-lg mb-2 capitalize">
                                            {group} ({Array.isArray(permissionItem) ? permissionItem.length : 0})
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {Array.isArray(permissionItem) && permissionItem.map((permission) => (
                                                <div key={`permission-${permission}`} className="flex items-center bg-gray-50 px-3 py-2 rounded">
                                                    {/* ✅ SOLUSI 3: Simple Checkbox Approach */}
                                                    <Checkbox
                                                        label={permission}
                                                        value={permission}
                                                        onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                                        checked={safeSelectedPermissions.includes(permission)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors?.selectedPermissions && (
                                <div className="text-xs text-red-500 mt-4">
                                    {errors.selectedPermissions}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type={"submit"} disabled={processing}>
                                {processing ? "Updating..." : "Update Role"}
                            </Button>
                            <Button
                                type={"cancel"}
                                url={route("roles.index")}
                            />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
