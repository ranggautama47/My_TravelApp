import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";
import Select2 from "@/Components/Select2";

export default function Edit({ auth }) { // ✅ FIX: tambah curly braces
    //destruct roles and user from usePage props
    const { user, roles } = usePage().props;

    //define state with user helper inertia
    const { data, setData, put, errors, processing } = useForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        selectedRoles: user.roles.map((role) => role.name) || [],
        password: "",
        password_confirmation: "",
    });

    const formattedRoles = roles.map((role) => ({
        value: role.name,
        label: role.name,
    }));

    // Get default values for Select2
    const defaultRoles = user.roles.map((role) => ({
        value: role.name,
        label: role.name,
    }));

    //define method handleSelectedroles
    const handleSelectedRoles = (selected) => {
        const selectedValues = selected ? selected.map((option) => option.value) : [];
        setData("selectedRoles", selectedValues);
    };

    // DEFINE METHOD handleUpdateData
    const handleUpdateData = async (e) => {
        e.preventDefault();

        put(route("users.update", user.id), {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Data Updated Successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit User
                </h2>
            }
        >
            <Head title={`Edit User - ${user.name}`} />
            <Container>
                <Card title={`Edit User: ${user.name}`}>
                    <form onSubmit={handleUpdateData}>
                        {/* Name Field */}
                        <div className="mb-4">
                            <Input
                                label="Name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)} // ✅ FIX: typo
                                errors={errors.name}
                                placeholder="Input name user.."
                            />
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <Input
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                errors={errors.email}
                                placeholder="Input email user.."
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="mb-4">
                            <Input
                                label="Phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)} // ✅ FIX: huruf kecil
                                errors={errors.phone}
                                placeholder="Input phone user.."
                            />
                        </div>

                        {/* Roles Field */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                                Roles
                            </div>
                            <Select2
                                isMulti
                                options={formattedRoles}
                                defaultValue={defaultRoles} // ✅ FIX: tambah defaultValue
                                onChange={handleSelectedRoles}
                                placeholder="Pilih Role.."
                            />
                            {errors.selectedRoles && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.selectedRoles}
                                </div>
                            )}
                        </div>

                        {/* Password Field (Optional) */}
                        <div className="mb-4">
                            <Input
                                label="Password (Leave empty to keep current password)"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                errors={errors.password}
                                placeholder="Input new password (optional).."
                            />
                        </div>

                        {/* Password Confirmation Field */}
                        <div className="mb-4">
                            <Input
                                label="Password Confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                errors={errors.password_confirmation}
                                placeholder="Confirm new password..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Updating..." : "Update Data"}
                            </Button>
                            <Button
                                type="cancel"
                                url={route("users.index")}
                            />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
