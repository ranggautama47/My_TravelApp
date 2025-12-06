import React from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export default function Create({auth, categories}) {


    const formatRupiah = (value) => {
        // Jika nilai null, undefined, atau string kosong, kembalikan string kosong
        if (!value) return '';

        // Pastikan nilainya adalah number atau string yang bisa dikonversi ke number
        const number = Number(value);
        if (isNaN(number)) return '';

        // Gunakan toLocaleString dengan locale 'id-ID' (Indonesia)
        // Indonesia menggunakan titik (.) sebagai pemisah ribuan dan koma (,) sebagai desimal.
        // Opsi ini memastikan tidak ada digit desimal yang ditampilkan.
        return number.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };
    //State untuk form denagn inertia.js
    const { data, setData, post, errors, processing } = useForm({
        ticket_category_id: '',
        qty: '',
        price_per_pack: '' // Ini akan menampung nilai angka bersih, misal: 400000
    });
    //handle submit form
    const handleCreateData = (e) => {
        e.preventDefault();

        post(route('tickets.store'),{
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
                <Head title="Create Tickets" />

                <Container>
                    <Card title="Create New Tickets">
                        <form onSubmit={handleCreateData}>
                            {/* Pilihan jenis tickets */}
                            <div className="mb-4">
                               <label className='block font-medium text-sm text-gray-700'>Ticket Type</label>
                               <select
                                    className='mt-1 block w-full border-gray-300 rounded-md shadow-xs focus:border-blue-300 focus:ring-3 focus:ring-blue-200 focus:ring-opacity-50'
                                    value={data.ticket_category_id}
                                    onChange={e => setData('ticket_category_id', e.target.value)}
                                >
                                    <option value="">Select Ticket Type</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.ticket_category_id && <div className="text-red-500 text-sm mt-1">{errors.ticket_category_id}</div>}
                            </div>
                            {/* input harga ticket */}
                            <div className='mb-4'>
                                <Input
                                    label="price (Rp)"
                                    type="text"
                                    value={formatRupiah(data.price_per_pack)}
                                    onChange={e => {
                                        const rawValue = e.target.value;
                                        const cleanValue = rawValue.replace(/\D/g, ''); // HANYA AMBIL ANGKA

                                        // Set data sebagai integer bersih
                                        setData('price_per_pack', cleanValue ? parseInt(cleanValue) : '');
                                    }}
                                    errors={errors.price_per_pack}
                                    placeholder="Enter ticket price .."
                                />
                                {/* Tambahkan pesan error untuk quantity */}
                                {errors.qty && <div className="text-red-500 text-sm mt-1">{errors.qty}</div>}
                            </div>

                            {/* input Jumlah ticket */}
                            <div className='mb-4'>
                                <Input
                                    label="Quantity"
                                    type="number"
                                    value={data.qty}
                                    onChange={e => setData('qty', e.target.value ? parseInt (e.target.value) :'')}
                                    errors={errors.qty}
                                    placeholder="Enter ticket quantity .."
                                />
                                 {errors.price_per_pack && <div className="text-red-500 text-sm mt-1">{errors.price_per_pack}</div>}
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
