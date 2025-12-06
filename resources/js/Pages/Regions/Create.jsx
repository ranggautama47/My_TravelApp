import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export default function Create({ auth }) {
    // state untuk from dengan inertia.js
    const { data, setData, post, errors } = useForm({
        name: "",
    });

    // ✅ Fungsi submit
    const handleCreateData = (e) => {
        e.preventDefault();

        post(route("regions.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil! 🎉",
                    text: "Region created successfully!",
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
                    Create Regions
                </h2>
            }
        >
            <Head title="Create Regions" />

            <Container>
                <Card title="Create Region">
                    <form onSubmit={handleCreateData} encType="multipart/form-data">
                        {/* Input Nama Region */}
                        <div className="mb-4">
                            <Input
                                label="Region Name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                errors={errors.name}
                                placeholder="Input region name..."
                            />
                        </div>

                        {/* Tombol Simpan dan Batal */}
                        <div className="flex items-center gap-2">
                            <Button type="submit" />
                            <Button type="cancel" url={route("regions.index")} />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
