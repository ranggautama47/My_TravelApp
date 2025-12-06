import React from "react";
import { useForm, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export default function Create({ auth }) {
    // define state with helper inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    // define method handleStoreData
    const handleStoreData = (e) => {
        e.preventDefault();

        post(route("permissions.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: "Success",
                    text: "Permission created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset("name");
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Permission
                </h2>
            }
        >
            <Head title="Create Permission" />

            <Container>
                <Card title="Create New Permission">
                    <form onSubmit={handleStoreData}>
                        <div className="mb-4">
                            <Input
                                label="Permission Name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                errors={errors.name}
                                placeholder="Input permission name..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                            <Button type="cancel" url={route("permissions.index")}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
