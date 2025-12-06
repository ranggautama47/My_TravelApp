import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Table from "@/Components/Tabel";
import Button from "@/Components/Button";
import Pagination from "@/Components/Pagination";
import { Head, usePage } from "@inertiajs/react";
import Search from "@/Components/Search";
import hasAnyPermission from "@/Utils/permissions";

export default function Index() {
    // destruct location props
    const { auth, locations, filters } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(null); // State untuk image preview
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Locations
                </h2>
            }
        >
            <Head title={"Locations"} />
            <Container>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {hasAnyPermission(auth.user, ["locations create"]) && (
                        <Button type={"add"} url={route("locations.create")} />
                    )}

                    <div className="w-full md:w-4/6">
                        <Search
                            url={route("locations.index")}
                            placeholder={"Search locations data by name..."}
                            filter={filters}
                        />
                    </div>
                </div>
                <Table.Card title={"Locations"}>
                    <div className="overflow-x-auto">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>

                                <Table.Th>Title</Table.Th>
                                <Table.Th>Image</Table.Th>
                                <Table.Th>Description</Table.Th>
                                <Table.Th>Office Hours</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Address</Table.Th>
                                <Table.Th>Latitude</Table.Th>
                                <Table.Th>Longitude</Table.Th>
                                <Table.Th>Category</Table.Th>
                                <Table.Th>Ticket Code</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {locations.data.map((location, i) => (
                                <tr key={location.id}>
                                    <Table.Td>
                                        {++i +
                                            (locations.current_page - 1) *
                                                locations.per_page}{" "}
                                    </Table.Td>
                                    <Table.Td>{location.title}</Table.Td>
                                    <Table.Td>
                                        {location.image_urls ?  (
                                            <div className="flex flex-col gap-2">
                                                {location.image_urls.map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={img}
                                                            alt={`Image${idx + 1}`}
                                                            className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-75 transition"
                                                            onClick={() => setSelectedImage(img)} //preview image onClick
                                                        />
                                                    ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">
                                                No Image
                                            </span>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: location.description,
                                            }}
                                        />
                                    </Table.Td>
                                    <Table.Td>{location.officehours}</Table.Td>
                                    <Table.Td>{location.phone}</Table.Td>
                                    <Table.Td>{location.address}</Table.Td>
                                    <Table.Td>{location.latitude}</Table.Td>
                                    <Table.Td>{location.longitude}</Table.Td>
                                    <Table.Td>
                                        {location.category
                                            ? location.category.name
                                            : "N/A"}
                                    </Table.Td>
                                    <Table.Td>
                                        {/* ✅ PERBAIKAN: Tampilkan semua tickets */}
                                        {location.tickets && location.tickets.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {location.tickets.map((ticket, index) => (
                                                    <div key={ticket.id} className="text-xs">
                                                        <div className="font-semibold">{ticket.ticket_code}</div>
                                                        <div className="text-gray-600">
                                                            {new Intl.NumberFormat('id-ID', {
                                                                style: 'currency',
                                                                currency: 'IDR',
                                                                minimumFractionDigits: 0,
                                                            }).format(ticket.price_per_pack)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            "N/A"
                                        )}
                                    </Table.Td>

                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {hasAnyPermission(auth.user, [
                                                "locations edit",
                                            ]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route(
                                                        "locations.edit",
                                                        location.id,
                                                    )}
                                                />
                                            )}
                                            {hasAnyPermission(auth.user, [
                                                "locations delete",
                                            ]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route(
                                                        "locations.destroy",
                                                        location.id,
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    </div>
                </Table.Card>

                <div className="mt-6 mb-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                    {locations.last_page !== 1 && (
                        <Pagination links={locations.links} />
                    )}
                </div>
            </Container>

            {/* Modal Image Preview */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)} // klik luar modal close
                >
                    <div className="relative max-w-4xl mx-auto">
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg"
                        >
                            X
                        </button>
                    </div>
                </div>

            )}
        </AuthenticatedLayout>
    );
}
