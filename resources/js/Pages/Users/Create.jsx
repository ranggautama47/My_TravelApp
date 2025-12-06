import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Select2 from "@/Components/Select2";
import Swal from "sweetalert2";

export default function Create({ auth }) {
    const { roles } = usePage().props;

    // inisialisasi form inertia
    const { data, setData, post, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        selectedRoles: [],
        password: "",
        password_confirmation: "",
    });

    // format roles untuk Select2
    const formattedRoles = roles.map((role) => ({
        value: role.name,
        label: role.name,
    }));

    // handler untuk select2
    const handleSelectedRoles = (selected) => {
        const selectedValues = selected.map((option) => option.value);
        setData("selectedRoles", selectedValues);
    };

    // simpan data
    const handleStoreData = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "User created successfully!",
                    icon: "success",
                    showConfirmButton: false, // boolean bukan string
                    timer: 1500,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-gray-800 leading-tight">
                    Create User
                </h2>
            }
        >
            <Head title="Create Users" />
            <Container>
                <Card title="Create new User">
                    <form onSubmit={handleStoreData}>
                        <div className="mb-4">
                            <Input
                                label="Name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                                placeholder="Input user name.."
                            />
                        </div>

                        <div className="mb-4">
                            <Input
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                error={errors.email}
                                placeholder="Input user email.."
                            />
                        </div>

                        <div className="mb-4">
                            <Input
                                label="Phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                error={errors.phone}
                                placeholder="Input phone user.."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-gray-600 text-sm block mb-1">
                                Roles
                            </label>
                            <Select2
                                onChange={handleSelectedRoles}
                                options={formattedRoles}
                                placeholder="Pilih Role.."
                            />
                            {errors.selectedRoles && (
                                <small className="text-xs text-red-500">
                                    {errors.selectedRoles}
                                </small>
                            )}
                        </div>

                        <div className="mb-4">
                            <Input
                                label="Password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                error={errors.password}
                                placeholder="Input password user.."
                            />
                        </div>

                        <div className="mb-4">
                            <Input
                                label="Password Confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                error={errors.password_confirmation}
                                placeholder="Input password confirmation..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" />
                            <Button type="cancel" url={route("users.index")} />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
