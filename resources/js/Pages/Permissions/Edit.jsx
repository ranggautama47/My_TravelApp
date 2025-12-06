import React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, usePage, useForm  } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export default function Edit({ auth }) {    //destruct permissions from usepage props
    const { permission } = usePage().props;

    //define state with helper inertia
     const { data, setData, put, errors } = useForm({
        name: permission.name,
    });

    //define method handleUpdateData
    const handleUpdateData = async (e) => {
        e.preventDefault();

        put(route("permissions.Update", permission.id), {
            onSuccess: () => {
                Swal.fire({
                    title: "success",
                    text: "Permission  updated  successfully!",
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
                <h2 className="font-semibold text-gray-800 leading-tight">
                    Edit Permissions
                </h2>
            }
        >
            <Head title={"Edit Permissions"} />
            <Container>
                <Card title={"Edit permission"}>
                    <form onSubmit={handleUpdateData}>
                        <div className="mb-4">
                            <Input
                                label={"Permission Name"}
                                type={"text"}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                errors={errors.name}
                                placeholder="Input permission name.."
                            />
                        </div>
                        <div className="flex item-center gap-2">
                            <Button type={"submit"} />
                            <Button
                                type={"cancel"}
                                url={route("permissions.index")}
                            />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
