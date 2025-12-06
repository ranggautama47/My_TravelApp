import DestinationCard from '@/Components/frontend/DestinationCard';
import ReactPaginate from "react-paginate";
import { Head, router } from "@inertiajs/react";
import { useState, useEffect  } from "react";
import UserLayout from '@/Layouts/UserLayout';

export default function Location({ locations, filters = {}, categories = [], auth }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(filters.category || "");

    useEffect(() => {
        setSelectedCategory(filters.category || "");
    }, [filters.category]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route("location.index"), {
            search: search,
            category: selectedCategory,
        });
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        router.get(route("location.index"), {
            search: search,
            category: categoryId,
        });
    };

    return (
        <>
            <Head title="Location" />
            <UserLayout auth={auth}>
                <section className="relative flex flex-col px-4 items-center font-poppins pt-40">
                    <div className="w-full h-[37.5rem] locations-hero absolute top-0 left-0 -z-10"></div>
                    <div className="flex flex-col md:flex-row gap-8 justify-between items-center container mx-auto">
                        <div className="w-full">
                            <h1 className="text-4xl font-semibold text-primary-opaque">
                                Location
                            </h1>
                            <p className="text-blue  mt-4">
                                Dapatkan Pengalaman Liburan Terbaik di sini
                            </p>
                        </div>
                        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
                            <input
                                type="text"
                                placeholder="Search for a destination"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white"
                            />
                            <button
                                type="submit"
                                className="py-3.5 px-8 text-white rounded-xl font-semibold bg-primary-opaque hover:cursor-pointer hover:bg-primary-hover transition-all whitespace-nowrap"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* ✅ FIX: Category buttons horizontal scrollable on mobile */}
                    <div className="mt-12 w-full container mx-auto">
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => handleCategoryClick("")}
                                className={`text-sm sm:text-base px-4 py-2 sm:py-3 sm:px-6 rounded-full hover:cursor-pointer transition-all whitespace-nowrap flex-shrink-0 ${
                                    selectedCategory === ""
                                        ? "bg-primary-opaque text-white"
                                        : "bg-white text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                ALL
                            </button>
                            {categories.map((category) => {
                                const isSelected = selectedCategory === category.id.toString();
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                        className={`text-sm sm:text-base px-4 py-2 sm:py-3 sm:px-6 rounded-full hover:cursor-pointer transition-all whitespace-nowrap flex-shrink-0 ${
                                            isSelected
                                                ? "bg-primary-opaque text-white"
                                                : "bg-white text-gray-500 hover:bg-gray-100"
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <main className="container px-4 relative mx-auto mt-12 mb-32 z-10 font-poppins">
                    {/* ✅ FIX: Responsive grid - 1 col mobile, 2 col tablet, 3 col desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-8">
                        {locations.data.length > 0 ? (
                            locations.data.map((item, idx) => (
                                <DestinationCard item={item} key={item.id || idx} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <h1 className="text-2xl text-gray-500">
                                    No locations found.
                                </h1>
                            </div>
                        )}
                    </div>

                    {locations.last_page > 1 && (
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="Next →"
                            onPageChange={(e) =>
                                router.get(route("location.index"), {
                                    search: search,
                                    category: selectedCategory,
                                    page: e.selected + 1,
                                })
                            }
                            pageRangeDisplayed={5}
                            forcePage={locations.current_page - 1}
                            pageCount={locations.last_page}
                            previousLabel="← Previous"
                            renderOnZeroPageCount={null}
                            containerClassName="list-unstyled py-4 flex items-center justify-center gap-4 w-full flex-wrap"
                            previousClassName="mr-auto font-poppins text-gray-500 font-medium hover:cursor-pointer"
                            nextClassName="ml-auto font-poppins text-gray-500 font-medium hover:cursor-pointer"
                            pageClassName="w-10 h-10 sm:w-12 sm:h-12 hover:cursor-pointer grid place-content-center rounded-full text-gray-500 hover:bg-primary-transparent font-medium font-poppins"
                            activeClassName="w-10 h-10 sm:w-12 sm:h-12 hover:cursor-pointer grid place-content-center rounded-full text-gray-500 bg-primary-transparent text-primary-opaque font-medium font-poppins"
                        />
                    )}
                </main>
            </UserLayout>

        </>
    );
}
