import ReviewCard from "@/Components/frontend/ReviewCard";
import { Head } from "@inertiajs/react";
import { useEffect, useState, useMemo, useRef } from "react";
import GalleryDialog from "@/Components/frontend/GalleryDialog";
import ReviewDialog from "@/Components/frontend/ReviewDialog";
import Dropdown from "@/Components/ui/Dropdown";
import { categoryColors } from "@/Utils/Constants";
import { toIDR, getStars, calculateRating } from "@/Utils/helper";
import { router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import Map from "@/Components/frontend/Map";
import { Link } from "@inertiajs/react";

export default function Location({
    location,
    ratingAverages,
    ticketCategories,
    auth,
}) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const [ticketAmount, setTicketAmount] = useState(1);
    // safe defaults: support both `location.ticket` and `location.tickets`,
    // and support ticketCategories coming as paginated object (with .data)
    const tickets = location?.ticket ?? location?.tickets ?? [];
    const categoriesList = ticketCategories?.data ?? ticketCategories ?? [];
    const initialTicketType =
        categoriesList?.[0]?.id ?? tickets?.[0]?.ticket_category_id ?? null;
    const [ticketType, setTicketType] = useState(initialTicketType);

    const [ticketPrice, setTicketPrice] = useState(
        tickets.find((t) => t.ticket_category_id === initialTicketType)
            ?.price_per_pack ?? 0,
    );

    const mapRef = useRef();

    // safe ratings fallback to avoid runtime errors when ratingAverages is undefined
    const ratings = {
        rate_kebersihan: ratingAverages?.rate_kebersihan ?? 0,
        rate_keakuratan: ratingAverages?.rate_keakuratan ?? 0,
        rate_checkin: ratingAverages?.rate_checkin ?? 0,
        rate_komunikasi: ratingAverages?.rate_komunikasi ?? 0,
        rate_lokasi: ratingAverages?.rate_lokasi ?? 0,
        rate_nilaiekonomis: ratingAverages?.rate_nilaiekonomis ?? 0,
    };

    useEffect(() => {
        // find in unified tickets array
        const ticket = tickets.find((t) => t.ticket_category_id === ticketType);
        setTicketPrice(ticket?.price_per_pack ?? 0);
    }, [ticketType, tickets]);

    const totalPrice = useMemo(() => {
        const tax = ticketPrice * 0.1 * ticketAmount;
        return ticketAmount * ticketPrice + tax;
    }, [ticketPrice, ticketAmount]);

    const calculateTicketPrice = () => {
        return totalPrice.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    };

    const orderTicket = () => {
        if (!auth.user) {
            router.get(route("login"));
            return;
        }

        const tax = ticketPrice * 0.1 * ticketAmount;
        router.post(
            route("payment.handle"),
            {
                location_id: location.id,
                ticket_price: ticketPrice,
                ticket_quantity: ticketAmount,
                tax: tax,
                total_price: totalPrice,
                action: "pay",
                ticket_id: tickets.find(
                    (ticket) => ticket.ticket_category_id === ticketType,
                )?.id,
            },
            {
                onError: (error) => {
                    Swal.fire({
                        title: "Gagal!",
                        text: "Transaksi gagal!",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                },
            },
        );
    };

    const handleStart = () => {
        mapRef.current?.startNavigation();
    };

    return (
        <>
            <Head title="Details" />
            <UserLayout auth={auth}>
                <section className="relative flex flex-col items-center font-poppins pt-40 px-4">
                    <div className="w-full h-[37.5rem] details-hero absolute top-0 left-0 -z-10"></div>
                    <div className="container mx-auto">
                        <div className="w-full">
                            <h1 className="text-4xl font-semibold">
                                <span className="text-white">
                                    Location &gt;{" "}
                                </span>
                              <Link
                                href="/location"
                                className="text-gray-500 hover:text-primary-opaque hover:underline cursor-pointer transition"
                                >
                                {location.title}
                             </Link>
                            </h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 relative">
                            <div className="overflow-hidden object-cover aspect-[16/9.2]">
                                <img
                                    src={location.image_urls[0]}
                                    alt={location.title}
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {location.image_urls
                                    .slice(1, 5)
                                    .map((picture, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="overflow-hidden object-cover aspect-video"
                                            >
                                                <img
                                                    src={picture}
                                                    alt={`Picture ${index + 1}`}
                                                    className="w-full"
                                                />
                                            </div>
                                        );
                                    })}
                            </div>

                            <button
                                className="py-2.5 px-4.5 bg-white hover:cursor-pointer text-gray-400 rounded-full font-medium absolute right-4 bottom-4 text-xs"
                                onClick={() => setIsGalleryOpen(true)}
                            >
                                Tampilkan Semua Foto{" "}
                                <i className="bi bi-arrow-right"></i>
                            </button>

                            <GalleryDialog
                                isOpen={isGalleryOpen}
                                setIsOpen={setIsGalleryOpen}
                                destination={location.title}
                                pictures={location.image_urls}
                            />
                        </div>
                    </div>
                </section>

                <main className="container mx-auto font-poppins mt-6 px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
                        <div className="col-span-1 md:col-span-8">
                            <p
                                className={`py-1.5 px-6 ${
                                    categoryColors[location.category.id]
                                } text-white rounded-full w-fit`}
                            >
                                {location.category.name}
                            </p>
                            <div className="mt-8">
                                <h2 className="text-3xl text-primary-opaque font-semibold">
                                    {location.title}
                                </h2>
                                <div
                                    className="text-lg font-semibold hover:cursor-pointer w-fit"
                                    onClick={() => setIsReviewOpen(true)}
                                >
                                    <span className="text-xorange">
                                        <i className="bi bi-star-fill"></i>{" "}
                                        <span>{getStars(calculateRating(ratings))}</span>
                                    </span>
                                    <span className="text-gray-500">
                                        {" "}
                                        ● {location.reviews.length || 0} Reviews
                                    </span>
                                </div>
                            </div>
                            <hr className="border my-9 border-gray-200" />
                            <div>
                                <h3 className="text-2xl font-semibold">
                                    <i className="bi bi-info-circle-fill text-gray-300 mr-2"></i>
                                    <span className="text-gray-500">
                                        Information
                                    </span>
                                </h3>
                                <div className="flex gap-2.5 mt-4 items-center">
                                    <i className="bi bi-geo-alt text-gray-600"></i>
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Address
                                        </p>
                                        <p className="text-gray-600 font-medium">
                                            {location.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 mt-4 items-center">
                                    <i className="bi bi-telephone text-gray-600"></i>
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Phone
                                        </p>
                                        <p className="text-gray-600 font-medium">
                                            {location.phone}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 mt-4 items-center">
                                    <i className="bi bi-clock text-gray-600"></i>
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Office Hours
                                        </p>
                                        <p className="text-gray-600 font-medium">
                                            {location.officehours}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <hr className="border my-9 border-gray-200" />
                            <div>
                                <h3 className="mb-5 text-2xl font-semibold text-gray-500">
                                    Description
                                </h3>
                                <p
                                    className="text-gray-600"
                                    dangerouslySetInnerHTML={{
                                        __html: location.description,
                                    }}
                                ></p>
                            </div>
                            <hr className="border my-9 border-gray-200" />
                            <div>
                                <h3 className="mb-5 text-2xl font-semibold text-gray-500">
                                    Maps
                                </h3>
                                <div className="flex gap-2.5 mt-4 items-center">
                                    <i className="bi bi-geo-alt text-gray-600"></i>
                                    <div>
                                        <p className="text-gray-600 font-medium">
                                            {location.address}
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                                                target="_blank"
                                                className="text-sm text-gray-400 underline"
                                            >
                                                See in Google Maps
                                            </a>
                                            <span className="text-sm text-gray-400">
                                                or
                                            </span>
                                            <button
                                                    onClick={handleStart}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-gray-400 underline hover:text-primary-opaque cursor-pointer transition"
                                                >
                                                    Navigate
                                                </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mt-5">
                                    <div
                                        id="maps"
                                        className="h-[600px] w-full sticky top-36 rounded-3xl overflow-hidden"
                                    >
                                        <Map
                                            lat={Number(location.latitude)}
                                            long={Number(location.longitude)}
                                            location={location}
                                            ref={mapRef}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR - TICKET CARD */}
                        <div
                            className="col-span-1 lg:col-span-4
                                    mt-8 lg:mt-0 flex flex-col gap-6
                                    items-center lg:items-stretch
                                    w-full"
                        >
                            {/* Info bar */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center text-center py-5 w-full rounded-2xl bg-white shadow-md border border-gray-200 px-4">
                                <i className="bi bi-tag-fill text-primary-opaque text-3xl sm:text-4xl scale-x-[-1]"></i>
                                <p className="font-semibold text-gray-500 text-sm sm:text-base leading-tight">
                                    The price includes all costs
                                </p>
                            </div>

                            {/* Ticket Box */}
                            <div className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-none rounded-2xl bg-white shadow-lg border border-gray-200">
                                <div className="bg-primary-transparent text-primary-opaque w-fit font-semibold py-2.5 px-5 rounded-xl text-sm sm:text-base">
                                    <i className="bi bi-ticket-perforated mr-2"></i>
                                    <span>
                                        {tickets.find(
                                            (ticket) =>
                                                ticket.ticket_category_id ===
                                                ticketType,
                                        )?.qty ?? 0}{" "}
                                        Available Tickets
                                    </span>
                                </div>

                                <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center mt-6 gap-2">
                                    <span className="font-semibold text-gray-400 text-sm sm:text-base">
                                        Ticket Type
                                    </span>
                                    <Dropdown
                                        options={categoriesList.map(
                                            (category) => ({
                                                label: category.name,
                                                value: category.id,
                                            }),
                                        )}
                                        value={ticketType}
                                        onChange={setTicketType}
                                    />
                                </div>

                                {/* Price Control */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5 items-center">
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Ticket Price x{ticketAmount}
                                        </p>
                                        <p className="text-lg sm:text-xl font-semibold text-gray-600">
                                            {toIDR(ticketPrice)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end sm:justify-start gap-3 sm:gap-4">
                                        <button
                                            className="rounded-md bg-gray-200 hover:bg-gray-400 w-8 h-8 flex items-center justify-center disabled:opacity-50"
                                            onClick={() =>
                                                setTicketAmount(
                                                    ticketAmount - 1,
                                                )
                                            }
                                            disabled={
                                                ticketAmount <= 1 || !auth.user
                                            }
                                        >
                                            <i className="bi bi-dash"></i>
                                        </button>
                                        <p className="text-lg font-semibold text-gray-600 min-w-[2ch] text-center">
                                            {ticketAmount}
                                        </p>
                                        <button
                                            className="rounded-md bg-gray-200 hover:bg-gray-400 w-8 h-8 flex items-center justify-center disabled:opacity-50"
                                            onClick={() =>
                                                setTicketAmount(
                                                    ticketAmount + 1,
                                                )
                                            }
                                            disabled={
                                                ticketAmount >= 999 ||
                                                !auth.user
                                            }
                                        >
                                            <i className="bi bi-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <hr className="border my-8 border-gray-200" />

                                <div className="space-y-3 sm:space-y-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-400 text-sm sm:text-base">
                                            PPN (10%)
                                        </p>
                                        <p className="text-sm sm:text-lg font-semibold text-gray-500">
                                            {toIDR(
                                                ticketPrice *
                                                    0.1 *
                                                    ticketAmount,
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-400 text-sm sm:text-base">
                                            Total Price
                                        </p>
                                        <p className="text-sm sm:text-lg font-semibold text-gray-500">
                                            {calculateTicketPrice()}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={orderTicket}
                                    className="text-white bg-primary-opaque py-3 sm:py-4 w-full rounded-xl font-semibold hover:bg-primary-hover transition-all text-sm sm:text-base"
                                >
                                    Pesan Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <section className="container mx-auto font-poppins mb-32 px-4">
                    <hr className="border my-9 border-gray-200" />
                    <h3 className="text-2xl font-semibold text-gray-500">
                        <span>
                            <i className="bi bi-star-fill"></i>{" "}
                            <span>{getStars(calculateRating(ratings))}</span>
                        </span>
                        <span>
                            {" "}
                            ● {(location.reviews ?? []).length || 0} Reviews
                        </span>
                    </h3>
                    <div className="grid grid-cols-2 md:flex flex-1 gap-4 mt-9">
                        <div className="border-0 md:border-r md:border-gray-200 px-4 w-full">
                            <p className="font-medium text-gray-600 text-sm">
                                Nilai Keseluruhan
                            </p>
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                    {ratings.rate_kebersihan}
                                </span>
                                <progress
                                    className="rating-progress"
                                    value={ratings.rate_kebersihan}
                                    max="5"
                                ></progress>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                    {ratings.rate_keakuratan}
                                </span>
                                <progress
                                    className="rating-progress"
                                    value={ratings.rate_keakuratan}
                                    max="5"
                                ></progress>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                    {ratings.rate_checkin}
                                </span>
                                <progress
                                    className="rating-progress"
                                    value={ratings.rate_checkin}
                                    max="5"
                                ></progress>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                    {ratings.rate_komunikasi}
                                </span>
                                <progress
                                    className="rating-progress"
                                    value={ratings.rate_komunikasi}
                                    max="5"
                                ></progress>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                    {ratings.rate_lokasi}
                                </span>
                                <progress
                                    className="rating-progress"
                                    value={ratings.rate_lokasi}
                                    max="5"
                                ></progress>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                    {ratings.rate_nilaiekonomis}
                                </span>
                                <progress
                                    className="rating-progress"
                                    value={ratings.rate_nilaiekonomis}
                                    max="5"
                                ></progress>
                            </div>
                        </div>
                        <div className="border-0 md:border-r md:border-gray-200 px-4 w-full">
                            <p className="font-medium text-gray-600 text-sm">
                                Kebersihan
                            </p>
                            <div className="mt-4 text-sm text-gray-600 font-semibold">
                                <span>
                                    <i className="bi bi-star-fill"></i>{" "}
                                    <span>{ratings.rate_kebersihan}</span>
                                </span>
                            </div>
                        </div>
                        <div className="border-0 md:border-r md:border-gray-200 px-4 w-full">
                            <p className="font-medium text-gray-600 text-sm">
                                Keakuratan
                            </p>
                            <div className="mt-4 text-sm text-gray-600 font-semibold">
                                <span>
                                    <i className="bi bi-star-fill"></i>{" "}
                                    <span>{ratings.rate_keakuratan}</span>
                                </span>
                            </div>
                        </div>
                        <div className="border-0 md:border-r md:border-gray-200 px-4 w-full">
                            <p className="font-medium text-gray-600 text-sm">
                                Check-In
                            </p>
                            <div className="mt-4 text-sm text-gray-600 font-semibold">
                                <span>
                                    <i className="bi bi-star-fill"></i>{" "}
                                    <span>{ratings.rate_checkin}</span>
                                </span>
                            </div>
                        </div>
                        <div className="border-0 md:border-r md:border-gray-200 px-4 w-full">
                            <p className="font-medium text-gray-600 text-sm">
                                Komunikasi
                            </p>
                            <div className="mt-4 text-sm text-gray-600 font-semibold">
                                <span>
                                    <i className="bi bi-star-fill"></i>{" "}
                                    <span>{ratings.rate_komunikasi}</span>
                                </span>
                            </div>
                        </div>
                        <div className="border-0 md:border-r md:border-gray-200 px-4 w-full">
                            <p className="font-medium text-gray-600 text-sm">
                                Lokasi
                            </p>
                            <div className="mt-4 text-sm text-gray-600 font-semibold">
                                <span>
                                    <i className="bi bi-star-fill"></i>{" "}
                                    <span>{ratings.rate_lokasi}</span>
                                </span>
                            </div>
                        </div>
                        <div className="px-4 w-full">
                            <p className="font-medium text-gray-600 text-sm">
                                Nilai Ekonomis
                            </p>
                            <div className="mt-4 text-sm text-gray-600 font-semibold">
                                <span>
                                    <i className="bi bi-star-fill"></i>{" "}
                                    <span>{ratings.rate_nilaiekonomis}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-16">
                        {location.reviews.slice(0, 5).map((review, idx) => {
                            return <ReviewCard key={idx} review={review} />;
                        })}
                    </div>

                    <button
                        className="py-3.5 px-6 rounded-lg border border-gray-400 text-gray-500 mt-8 font-medium hover:cursor-pointer hover:bg-gray-100 transition-all"
                        onClick={() => setIsReviewOpen(true)}
                    >
                        Tampilkan Semua{" "}
                        <span className="font-semibold text-gray-600">
                            {location.reviews.length || 0}
                        </span>{" "}
                        Ulasan
                    </button>

                    <ReviewDialog
                        isOpen={isReviewOpen}
                        setIsOpen={setIsReviewOpen}
                        reviews={location.reviews}
                        ratings={ratingAverages}
                    />
                </section>
            </UserLayout>
        </>
    );
}
