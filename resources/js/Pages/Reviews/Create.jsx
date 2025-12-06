import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";
import { formatDate } from "@/Utils/helper";
import { InteractiveRatingStars } from "./Edit"

export default function Create({ auth }) {
    const { transactions } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        transaction_id: "",
        rate_checkin: 0,
        rate_lokasi: 0,
        rate_kebersihan: 0,
        rate_komunikasi: 0,
        rate_keakuratan: 0,
        rate_nilaiekonomis: 0,
        review: ""
    });

    const handleCreate = (e) => {
        e.preventDefault();

        post(route("reviews.store"), {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Review berhasil ditambahkan!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    // cari lokasi yang dipilih untuk mendapatkan image-nya
    const selectedLocation = transactions.find(
        (transaction) => transaction.id == data.transaction_id
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Review
                </h2>
            }
        >
            <Head title="Tambah Review" />

            <Container>
                <Card title="Buat Review Baru">
                    <form onSubmit={handleCreate} className="space-y-4">
                        {/* menampilkan lokasi user yang sedang login */}
                        <div className="mb-4">
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-xs bg-gray-100"
                                value={auth.user.name}
                                disabled
                            />
                        </div>
                        {/* Pilih lokasi*/}
                        <div className="mb-4">
                            <label className="block font-medium text-sm text-sm text-gray-700">Transaction</label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-xs"
                                value={data.transaction_id}
                                onChange={e => setData('transaction_id', e.target.value)}
                            >
                            <option value="">Selection Transaction</option>
                            {transactions.map(transaction => (
                                    <option
                                    key={transaction.id}
                                    value={transaction.id}
                                    >
                                            {transaction.code} -{""}
                                            {transaction.location?.title} -{""}
                                            {formatDate(transaction.updated_at )}
                                    </option>
                            ))}
                            </select>
                            {errors.transaction_id && <div className="text-red-500 text-sm mt-1">{errors.transaction_id}</div>}
                        </div>

                        {/*menampilkan gambar berdasarkan lokasi yang dipilih*/}
                        {selectedLocation && selectedLocation.image_urls && (
                            <div className="mb-4">
                                <label className="block font-medium text-sm text-gray-700">
                                    Preview Image
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                    {selectedLocation.image_urls.length > 0 &&
                                        selectedLocation.image_urls.map((item, index) => (
                                            <img
                                                key={index}
                                                src={item}
                                                alt={`location-${selectedLocation.id}-${index}`}
                                                className="w-full h-48 object-cover overflow-hidden"
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                        {/* Input Review */}
                        <div>
                            <Input
                                label="Tulis Review"
                                type="textarea"
                                value={data.review}
                                onChange={(e) =>
                                    setData("review", e.target.value)
                                }
                                errors={errors.review}
                                placeholder="Masukkan ulasan Anda..."
                            />
                        </div>

                        {/* Rating Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InteractiveRatingStars
                                    label='kebersihan'
                                    rating={data.rate_kebersihan}
                                    onChange={(val) =>
                                        setData('rate_kebersihan', val)
                                    }
                            />
                             <InteractiveRatingStars
                                    label='keakuratan'
                                    rating={data.rate_keakuratan}
                                    onChange={(val) =>
                                        setData('rate_keakuratan', val)
                                    }
                            />
                             <InteractiveRatingStars
                                    label='Check In'
                                    rating={data.rate_checkin}
                                    onChange={(val) =>
                                        setData('rate_checkin', val)
                                    }
                            />
                             <InteractiveRatingStars
                                    label='komunikasi'
                                    rating={data.rate_komunikasi}
                                    onChange={(val) =>
                                        setData('rate_komunikasi', val)
                                    }
                            />
                            <InteractiveRatingStars
                                    label='Lokasi'
                                    rating={data.rate_lokasi}
                                    onChange={(val) =>
                                        setData('rate_lokasi', val)
                                    }
                            />
                            <InteractiveRatingStars
                                    label='Nilai Ekonomis'
                                    rating={data.rate_nilaiekonomis}
                                    onChange={(val) =>
                                        setData('rate_nilaiekonomis', val)
                                    }
                            />
                        </div>
                        {/* Tombol Submit & cancel*/}
                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan Review"}
                            </Button>
                            <Button
                                type="cancel"
                                url={route("reviews.index")}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
