import Navbar from "@/Components/ui/Navbar";
import { Head } from "@inertiajs/react";
import { useState } from "react";

import { router } from '@inertiajs/react';
import UserLayout from "@/Layouts/UserLayout";

export default function Welcome({ categories, auth }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("location.index"), {
            search: search,
        });
    };

    return (
        <>
            <Head title="Welcome" />
             <UserLayout auth={auth}>
                <section className="relative flex flex-col items-center w-full h-[60vh] homepage-hero font-poppins">
                    <h1 className="text-5xl font-semibold text-[#38505C] text-center mt-48 sm:mt-64">
                        Find The Best Vacation Spots
                    </h1>

                    <div className="absolute left-1/2 bottom-[-4rem] transform -translate-x-1/2 bg-white rounded-4xl shadow-custom px-8 py-10 w-[90%] max-w-[800px] z-10">
                        <div className="mb-6 sm:mb-10">
                            <p className="text-lg font-semibold mb-1.5 text-primary-opaque">
                                Find Destinations
                            </p>
                            <p className="text-gray-500">
                                Discover the Best Destination in Indonesia
                            </p>
                        </div>

                        {/* ganti <search> menjadi <form> */}
                        <form
                            className="flex flex-col sm:flex-row gap-4 w-full"
                            onSubmit={handleSearch}
                        >
                            <input
                                type="text"
                                placeholder="Search for a destination"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300"
                            />
                            <button
                                type="submit"
                                className="py-3.5 px-8 text-white rounded-xl font-semibold bg-primary-opaque hover:cursor-pointer hover:bg-primary-hover transition-all"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </section>

                <main className="container mx-auto grid md:grid-cols-3 grid-cols-1 gap-12 my-32 px-4">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            onClick={() =>
                                router.get(route("location.index"), {
                                    category: category.id,
                                })
                            }
                            className="relative flex flex-col item-center hover:cursor-pointer"
                        >
                            <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full"
                                draggable="false"
                            />

                        </div>
                    ))}
                </main>
            </UserLayout>
        </>
    );
}
