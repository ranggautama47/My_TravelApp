import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export default function Edit({ auth }) {
    // ✅ Ambil data region dari props inertia
    const { region } = usePage().props;

    //  Destructuring pakai kurung kurawal
    const { data, setData, post, errors, processing } = useForm({
        name: region.name,
         _method: "PUT",
    });

    // Jandle update form
    const handleUpdateData = (e) => {
        e.preventDefault();

        post(route("regions.update", region.id), {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil! 🎉",
                    text: "Region update successfully!",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
            onError: (errors) => {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update region. Please check the form.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#ef4444",
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Regions
                </h2>
            }
        >
            <Head title="Edit Regions" />

            <Container>
                <Card title="Edit  Region">
                    <form onSubmit={handleUpdateData} encType="multipart/form-data">
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
                            <Button type="submit"  disabled={processing}>
                                 {processing ? "Updating..." : "Update Region"}
                            </Button>
                            <Button type="cancel" url={route("regions.index")} />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
