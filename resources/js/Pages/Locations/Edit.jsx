import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Card from "@/Components/Card";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Editor } from '@tinymce/tinymce-react';
import Map from "@/Components/frontend/Map";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

export default function Edit({ auth }) {
    //destruct permissions from usepage props
    const { location, categories, tickets, regions } = usePage().props;

    console.log("Location Data:", location);
    console.log("All Available Tickets Grouped:", tickets);
    // === Helper Function untuk format Rupiah ===
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };
       // === Komponen untuk menampilkan Current Tickets ===
    const CurrentTicketsDisplay = ({ location }) => {
        if (!location.tickets || location.tickets.length === 0) {
            return null;
        }

        return (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-blue-600">🎫</span>
                    <h3 className="text-lg font-semibold text-blue-800">Current Tickets</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {location.tickets.length} ticket(s) selected
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {location.tickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-800 text-sm">
                                    {ticket.ticket_code}
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    {ticket.category?.name || "Uncategorized"}
                                </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                                {ticket.name}
                            </div>
                            <div className="font-semibold text-green-600 text-sm">
                                {formatRupiah(ticket.price_per_pack)}
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-blue-600 mt-3 flex items-center gap-1">
                    <span>💡</span>
                    Select new tickets below to replace current selection
                </p>
            </div>
        );
    };
    // === Komponen Dropzone untuk Edit ===
    const ImageDropzone = ({ files, setFiles, existingImages, errors }) => {
        const fileInputRef = React.useRef(null);
        const [isDragging, setIsDragging] = React.useState(false);

       const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = [];
        const maxSize = 2.5 * 1024 * 1024; // 2.5MB dalam bytes

        selectedFiles.forEach((file) => {
            if (file.size > maxSize) {
                alert(`⚠️ File "${file.name}" terlalu besar! (Max 2,5 MB)`);
            } else {
                validFiles.push(file);
            }
        });

        if (validFiles.length > 0) {
            setFiles([...(Array.isArray(files) ? files : []), ...validFiles]);
            console.log("✅ Files ditambahkan:", validFiles.length);
        }
    };


        const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    const validFiles = [];
    const maxSize = 2.5 * 1024 * 1024; // 2.5MB dalam bytes


    droppedFiles.forEach((file) => {
        if (file.size > maxSize) {
            alert(`⚠️ File "${file.name}" terlalu besar! (Max 2,5 MB)`);
        } else {
            validFiles.push(file);
        }
    });

    if (validFiles.length > 0) {
        setFiles([...(Array.isArray(files) ? files : []), ...validFiles]);
        console.log("✅ Files dropped:", validFiles.length);
    }
};


        const handleDragOver = (e) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const handleDragLeave = () => {
            setIsDragging(false);
        };

        const handleRemove = (index) => {
            const newFiles = (Array.isArray(files) ? files : []).filter((_, i) => i !== index);
            setFiles(newFiles);
            console.log("File removed, remaining:", newFiles.length);
        };

        return (
            <div className="mb-6">
                <label className="block mb-2 text-lg font-semibold text-gray-800">
                    Upload Images <span className="text-gray-500 text-sm">(optional - leave empty to keep existing)</span>
                </label>

                {/* Tampilkan Gambar Existing */}
                {existingImages && existingImages.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current Images ({existingImages.length}):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {existingImages.map((imgUrl, index) => (
                                <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                    <img
                                        src={imgUrl}
                                        alt={`Existing ${index}`}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs">Current</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <span>🖼️</span>
                            Upload new images below to replace current ones
                        </p>
                    </div>
                )}

                {/* Dropzone Area */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer
                        ${isDragging ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm"}
                        ${errors ? "border-red-500 bg-red-50" : ""}
                        p-10`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-gray-600 font-medium text-center">
                        <span className="text-blue-600 underline">Click to upload new images</span> or drag & drop here
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {errors && <div className="text-red-500 text-sm mt-2">{errors}</div>}

                {/* Preview New Images */}
                {Array.isArray(files) && files.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm text-green-600 mb-2 font-semibold">
                            ✓ {files.length} new file(s) selected (will replace existing images)
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative group rounded-xl overflow-hidden border-2 border-green-500 shadow-sm hover:shadow-lg transition-transform duration-300 hover:scale-[1.03]"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-full h-32 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ✅ PERBAIKAN: Initialize ticket_ids dari location existing
    const initialTicketIds = {};
    if (location.ticket && Array.isArray(location.ticket)) {
        location.ticket.forEach((ticket) => {
            const categoryName = ticket.category?.name || "Uncategorized";
            // Tambahkan debug di sini untuk melihat inisialisasi
            console.log(`Initializing Ticket: Category=${categoryName}, Ticket ID=${ticket.id}`);
            initialTicketIds[categoryName] = ticket.id;
        });
    }

    //define state with helper inertia
    const { data, setData, post, errors, progress, processing } = useForm({
        title: location.title || '',
        description: location.description || '',
        officehours: location.officehours || '',
        category_id: location.category_id || '',
        ticket_ids: initialTicketIds, // ✅ Load existing tickets
        region_id: location.region_id || '',
        phone: location.phone || '',
        address: location.address || '',
        latitude: location.latitude || '',
        longitude: location.longitude || '',
        image: [], // New images (optional)
        _method: 'put',
    });

    const [search, setSearch] = useState("");
    const [position, setPosition] = useState([data.latitude, data.longitude]);
    const [markerText, setMarkerText] = useState("Default location");
    const inputRef = useRef();
    useEffect(() => {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
            setPosition([lat, lng]);
        }
    }, [data.latitude, data.longitude]);

    // Handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Debug: Cek data sebelum submit
        console.log("Data to update:", {
            ...data,
            image_count: data.image.length,
            ticket_ids: data.ticket_ids
        });

        post(route('locations.update', location.id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("✅ Update success!");
            },
            onError: (errors) => {
                console.error("❌ Update failed:", errors);
            },
        });
    };

    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search.trim() || isSearching) return;

        setIsSearching(true);
        const query = encodeURIComponent(search);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`;

        try {
            const response = await fetch(url);
            const results = await response.json();

            console.log("Search results:", results);

            if (results.length > 0) {
                const lat = parseFloat(results[0].lat);
                const lon = parseFloat(results[0].lon);

                // ✅ Update position dan data dengan cepat
                setPosition([lat, lon]);
                setData("latitude", lat);
                setData("longitude", lon);
                setData("address", results[0].display_name);
                setMarkerText(results[0].display_name);

                // ✅ Success notification - langsung selesai
                Swal.fire({
                    title: "Success!",
                    text: "Location found!",
                    icon: "success",
                    confirmButtonText: "OK",
                    timer: 1500,
                });
            } else {
                // ✅ Not found - langsung selesai
                Swal.fire({
                    title: "Not Found!",
                    text: "Location not found! Please try different keywords.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    timer: 2000,
                });
            }
        } catch (err) {
            console.error("Search error:", err);
            // ✅ Error - langsung selesai
            Swal.fire({
                title: "Error!",
                text: "Failed to search location. Please check your connection.",
                icon: "error",
                confirmButtonText: "OK",
                timer: 2000,
            });
        } finally {
            // ✅ Pastikan loading berhenti dengan cepat
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(e);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Location
                </h2>
            }
        >
            <Head title={"Edit Location"} />
            <Container>
                <Card title="Edit Location">
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            errors={errors.title}
                        />

                        {/* TinyMCE Editor */}
                        <label className="block mb-1 font-semibold">Description</label>
                        <Editor
                            apiKey="ysmhprz8o6c4ubjx0l0yllub7v6qootziv1fpcm1r7psfmjt"
                            value={data.description}
                            init={{
                                height: 300,
                                menubar: false,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                                    'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | ' +
                                    'alignleft aligncenter alignright alignjustify | ' +
                                    'bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={(content) => setData('description', content)}
                        />
                        {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}

                        <Input label="Office Hours" value={data.officehours} onChange={(e) => setData('officehours', e.target.value)} errors={errors.officehours} />
                        <Input label="Phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} errors={errors.phone} />
                        <Input label="Address" value={data.address} onChange={(e) => setData('address', e.target.value)} errors={errors.address} />
                        <Input label="Latitude" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} errors={errors.latitude} />
                        <Input label="Longitude" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} errors={errors.longitude} />

                    <div className="mb-4">
                        <div className="relative">
                            <Input
                                label="Search Location"
                                type="text"
                                ref={inputRef}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Contoh: Jakarta, Bali, Monas, etc."
                                disabled={isSearching}
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-10">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching || !search.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                            >
                                {isSearching ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-search"></i>
                                        Search Location
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="w-full mt-5">
                            <div id="map" className="h-[600px] w-full sticky top-36 rounded-3xl overflow-hidden">
                                <Map
                                    lat={position[0]}
                                    long={position[1]}
                                    onMarkerDragEnd={(lat, lng) => {
                                        setData("latitude", lat);
                                        setData("longitude", lng);
                                        setPosition([lat, lng]);
                                    }}
                                    customMarkerText={markerText}
                                />
                            </div>
                        </div>
                    </div>

                        {/* Category Select */}
                        <label className="block">Category</label>
                        <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="w-full p-2 border rounded-sm mb-4">
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}

                        {/* Region Select */}
                        <label className="block">Region</label>
                        <select value={data.region_id} onChange={(e) => setData('region_id', e.target.value)} className="w-full p-2 border rounded-sm mb-4">
                            <option value="">Select Region</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>{region.name}</option>
                            ))}
                        </select>
                        {errors.region_id && <div className="text-red-500 text-sm mt-1">{errors.region_id}</div>}

                         {/* Ticket Select dengan Current Tickets Display */}
                        <div>
                            <label className="block font-semibold mb-2">Tickets</label>

                            {/* Tampilkan Current Tickets */}
                            <CurrentTicketsDisplay location={location} />

                            {/* Dropdown untuk memilih tickets baru */}
                            {Object.entries(tickets).map(([category, ticketList]) => (
                                <div key={category} className="mb-4">
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                        {category} Tickets
                                    </label>
                                    <select
                                        value={data.ticket_ids[category] || ""}
                                        onChange={(e) =>
                                            setData("ticket_ids", {
                                                ...data.ticket_ids,
                                                [category]: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded-sm"
                                    >
                                        <option value="">Select {category} Ticket</option>
                                        {ticketList.map((ticket) => (
                                            <option key={ticket.id} value={ticket.id}>
                                                {`${ticket.ticket_code} - ${formatRupiah(ticket.price_per_pack)}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            {errors.ticket_ids && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.ticket_ids}
                                </div>
                            )}
                        </div>
                        {/* Image Upload with Existing Preview */}
                        <ImageDropzone
                            files={Array.isArray(data.image) ? data.image : []}
                            setFiles={(newFiles) => setData("image", newFiles)}
                            existingImages={location.image_urls || []}
                            errors={errors.image}
                        />

                        {/* Upload Progress Bar */}
                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update'}
                            </Button>
                            <Button type="cancel" url={route("locations.index")}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
