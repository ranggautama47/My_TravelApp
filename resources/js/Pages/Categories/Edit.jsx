import React, { useState } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export default function Edit({ auth }) {
    const { category } = usePage().props;

    const { data, setData, put, processing, errors, progress } = useForm({
        name: category.name || "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    // Handle image change dengan preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission dengan validasi custom
   const handleUpdateData = (e) => {
    e.preventDefault();

    // Buat FormData manual
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('_method', 'PUT'); // Important untuk method override

    if (data.image) {
        formData.append('image', data.image);
    }

    // Gunakan router.post dengan FormData
    router.post(route('categories.update', category.id), formData, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
            Swal.fire({
                title: "Berhasil! 🎉",
                text: "Kategori berhasil diperbarui",
                icon: "success",
                confirmButtonColor: "#10b981",
                showConfirmButton: false,
                timer: 2000,
            });
        },
        onError: (errors) => {
            console.log("Errors:", errors);
            Swal.fire({
                title: "Gagal",
                text: errors.name || errors.image || "Terjadi kesalahan",
                icon: "error",
                confirmButtonColor: "#ef4444",
            });
        },
    });
};

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Kategori
                </h2>
            }
        >
            <Head title="Edit Kategori" />

            <Container>
                <Card
                    title="Edit Kategori"
                    className="max-w-2xl mx-auto shadow-lg rounded-xl border border-gray-100"
                >
                    <form
                        onSubmit={handleUpdateData}
                        encType="multipart/form-data"
                        className="space-y-6"
                    >
                        {/* Nama Kategori */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nama Kategori{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="name" // tambahkan ini!
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                errors={errors.name}
                                placeholder="Masukkan nama kategori..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Upload Gambar dengan Area yang Lebih Besar */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Gambar Kategori{" "}
                                {!category.image && (
                                    <span className="text-red-500">*</span>
                                )}
                            </label>

                            {/* Tampilkan gambar saat ini */}
                            {category.image && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Gambar Saat Ini:
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt={category.name}
                                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                                        />
                                        <div className="text-sm text-gray-600">
                                            <p>Gambar yang sedang aktif</p>
                                            <p className="text-xs text-gray-500">
                                                Pilih file baru untuk mengganti
                                                gambar
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Drag & Drop Area */}
                            <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                                ${errors.image ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}
                                ${imagePreview ? "border-green-300 bg-green-50" : ""}
                            `}
                            onClick={() => document.getElementById("image-upload").click()}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => {
                                e.preventDefault();
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleImageChange({ target: { files: e.dataTransfer.files } });
                                }
                            }}
                        >
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
                            />

                                {imagePreview ? (
                                    <div className="space-y-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="mx-auto h-32 w-32 object-cover rounded-lg shadow-md"
                                        />
                                        <p className="text-green-600 text-sm">
                                            ✅ Gambar baru dipilih. Klik untuk
                                            mengganti
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="mx-auto h-16 w-16 text-gray-400">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                <span className="text-blue-600 font-medium">
                                                    Klik untuk upload gambar
                                                    baru
                                                </span>{" "}
                                                atau drag & drop
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG, JPEG (Max. 2MB)
                                            </p>
                                            <p className="text-xs text-blue-500 mt-1">
                                                Kosongkan jika tidak ingin
                                                mengganti gambar
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        {/* Progress Bar dengan styling lebih soft */}
                        {progress && (
                            <div className="space-y-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-linear-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${progress.percentage}%`,
                                        }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    Mengupload... {progress.percentage}%
                                </p>
                            </div>
                        )}

                        {/* Action Buttons dengan styling lebih modern */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="cancel"
                                url={route("categories.index")}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Memperbarui...
                                    </div>
                                ) : (
                                    "✓ Perbarui Data"
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
