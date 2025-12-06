import React from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export default function Edit({ auth }) {
    const { ticket, categories } = usePage().props

// Fungsi Helper untuk memformat angka menjadi format Rupiah (e.g., 400.000)
    const formatRupiah = (value) => {
        if (value === null || value === undefined) return '';

        // Pastikan nilainya adalah number atau string yang bisa dikonversi ke number
        const number = Number(value);
        if (isNaN(number)) return '';

        return number.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

//State untuk form denagn inertia.js
    const { data, setData, post, errors, processing } = useForm({
        name: ticket.name,
        ticket_category_id: ticket.ticket_category_id,
        qty: ticket.qty,
        price_per_pack: ticket.price_per_pack,
        _method:'put'
    });

    //handle Update form
    const handleUpdateData = (e) => {
        e.preventDefault();

        post(route('tickets.update', ticket.id),{
            onSuccess: () =>{
                Swal.fire({
                    title: "Success",
                    text: "Tickets created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        })
    }
  return (
    <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Ticket
                </h2>
            }
        >
            <Head title="Edit Tickets" />

            <Container>
                <Card title="Edit  Tickets">
                    <form onSubmit={handleUpdateData}>
                        {/* Pilihan jenis tickets */}
                        <div className="mb-4">
                            <label className='block font-medium text-sm text-gray-700'>Ticket Type</label>
                            <select
                                className='mt-1 block w-full border-gray-300 rounded-md shadow-xs focus:border-blue-300 focus:ring-3 focus:ring-blue-200 focus:ring-opacity-50'
                                value={data.ticket_category_id}
                                onChange={e => setData('ticket_category_id', e.target.value)}
                            >
                                 {categories.map((category) => (
                                     <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
                        </div>
                        {/* input harga ticket */}
                        <div className='mb-4'>
                            <Input
                                label="price (Rp)"
                                type="text"
                                value={formatRupiah(data.price_per_pack)}
                                onChange={e => {
                                    // Hapus semua karakter non-digit (koma/titik) sebelum disimpan ke state
                                    const rawValue = e.target.value;
                                    const cleanValue = rawValue.replace(/\D/g, '');

                                    // Simpan nilai integer bersih ke state
                                    setData('price_per_pack', cleanValue ? parseInt(cleanValue) : 0);
                                }}
                                errors={errors.price_per_pack}
                                placeholder="Enter ticket price .."
                            />
                        </div>

                        {/* input Jumlah ticket */}
                        <div className='mb-4'>
                            <Input
                                label="Quantity"
                                type="number"
                                value={data.qty}
                                onChange={e => setData('qty', e.target.value ? parseInt(e.target.value) : 0)}
                                errors={errors.qty}
                                placeholder="Enter ticket quantity .."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                            <Button type="cancel" url={route("tickets.index")}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
        );
   }
