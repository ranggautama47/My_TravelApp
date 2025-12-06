import React from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, usePage, useForm  } from "@inertiajs/react";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Swal from "sweetalert2";

export const InteractiveRatingStars =({label, rating, max = 5, onChange}) => {
    return (
        <div className='mb-4'>
            <label className='block font-medium text-sm text-gray-700 mb-1'>{label}</label>
            <div className='flex gap-1'>
                {Array.from({ length: max }, (_, index) =>{
                    const starValue = index + 1;
                    return (
                        <span
                            key={index}
                            onClick={() => onChange(starValue)}
                            className={`text-3xl cursor-pointer ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        >
                          ★
                        </span>
                    );
                })}
                <span className="ml-2 text-gray-600 text-sm">({rating} / {max})</span>
            </div>
        </div>
    );
};

export default function Edit({auth}) {
    // destruct permissions from usepage props
    const { review, locations, transactions } = usePage().props;

        //define state with helper inertia
         const { data, setData, put, errors } = useForm({
            location_id: review.location_id,
            transaction_id: review. transaction_id,
            review: review.review,
            rate_kebersihan: review.rate_kebersihan,
            rate_keakuratan: review.rate_keakuratan,
            rate_checkin: review.rate_checkin,
            rate_komunikasi: review.rate_komunikasi,
            rate_lokasi: review.rate_lokasi,
            rate_nilaiekonomis: review.rate_nilaiekonomis,
            _method: 'put'
        });

        //define method handleUpdateData

    const handleUpdate = async (e) => {
        e.preventDefault();

        console.log('Data to update:', data);
        put(route("reviews.update", review.id), {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Review updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onError: (errors) => {
                console.log('Update errors:', errors);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update review. Please check the form.",
                    icon: "error",
                });
            },
        });
    };

        const selectedLocation = locations.find(location => location.id == data.location_id);
        const selectedTransaction  = transactions.find(transaction => transaction.id == data.transaction_id);

  return (
    <AuthenticatedLayout
               user={auth.user}
               header={
                   <h2 className="font-semibold text-gray-800 leading-tight">
                       Edit Review
                   </h2>
               }
           >
               <Head title={"Edit Review"} />
               <Container>
                   <Card title={"Edit Review"}>
                       <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block font-medium text-sm text-gray-700">User</label>
                            <Input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-xs bg-gray-100"
                                value={auth.user.name}
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-sm text-gray-700">Location</label>
                            <Input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-xs bg-gray-100"
                                value={selectedLocation ? selectedLocation.title : 'unknow'}
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-sm text-gray-700">Transaction</label>
                            <Input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-xs bg-gray-100"
                                value={selectedTransaction ? selectedTransaction.code : 'unknow'}
                                disabled
                            />
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


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <InteractiveRatingStars
                                    label="Kebersihan"
                                    rating={data.rate_kebersihan}
                                    onChange={(val) => setData('rate_kebersihan',val)}
                            />
                            <InteractiveRatingStars
                                    label="Keakuratan"
                                    rating={data.rate_keakuratan}
                                    onChange={(val) => setData('rate_keakuratan',val)}
                            />
                            <InteractiveRatingStars
                                    label="Check In"
                                    rating={data.rate_checkin}
                                    onChange={(val) => setData('rate_checkin',val)}
                            />
                            <InteractiveRatingStars
                                    label="Komunikasi"
                                    rating={data.rate_komunikasi}
                                    onChange={(val) => setData('rate_komunikasi',val)}
                            />
                            <InteractiveRatingStars
                                    label="Lokasi"
                                    rating={data.rate_lokasi}
                                    onChange={(val) => setData('rate_lokasi',val)}
                            />
                            <InteractiveRatingStars
                                    label="Nilai Ekonomis"
                                    rating={data.rate_nilaiekonomis}
                                    onChange={(val) => setData('rate_nilaiekonomis',val)}
                            />
                        </div>
                           <div className="flex item-center gap-2">
                               <Button type={"submit"}>Update</Button>
                               <Button
                                   type={"cancel"}
                                   url={route("reviews.index")}
                               >Cancel</Button>
                           </div>
                       </form>
                   </Card>
               </Container>
           </AuthenticatedLayout>
    )
}
