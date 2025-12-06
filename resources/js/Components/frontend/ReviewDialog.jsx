import { calculateRating, getStars } from "@/Utils/helper";
import ReviewCard from "./ReviewCard";
import Dropdown from "../ui/Dropdown";
import { useEffect, useState } from "react";
import { optionSortByDate } from "@/Utils/Constants";
import { Sparkles, MapPin, Key, MessageCircle, Map, Wallet } from "lucide-react";

export default function ReviewDialog({ isOpen, setIsOpen, reviews, ratings }) {
    const [orderBy, setOrderBy] = useState("");
    const [search, setSearch] = useState("");
    const [filteredReviews, setFilteredReviews] = useState(reviews);

    useEffect(() => {
        if (orderBy === "newest") {
            setFilteredReviews([...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } else if (orderBy === "oldest") {
            setFilteredReviews([...reviews].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        } else {
            setFilteredReviews(reviews);
        }
    }, [orderBy, reviews]);

    const handleBackdropClick = (event) => {
        if (event.target.tagName === "DIALOG") setIsOpen(false);
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        const filtered = reviews.filter((review) =>
            review.review.toLowerCase().includes(val.toLowerCase())
        );
        setFilteredReviews(filtered);
    };

    return (
        <dialog
            open={isOpen}
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-[999] grid place-content-center bg-black/20 backdrop-blur-sm p-2 ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div
                className="
                    flex flex-col
                    w-[95vw] md:w-[90vw] lg:w-[900px]
                    max-h-[90vh]
                    rounded-2xl bg-white overflow-hidden shadow-2xl
                "
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-gray-50 sticky top-0 z-10">
                    <p className="text-2xl md:text-3xl font-semibold text-primary-opaque">
                        Ulasan
                    </p>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-200 rounded-full"
                    >
                        <i className="bi bi-x-lg text-xl text-gray-600"></i>
                    </button>
                </div>

                {/* MAIN CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
                    {/* LEFT SIDEBAR */}
                    <div className="col-span-1 space-y-6">
                        {/* Badge Score */}
                        <div className="flex flex-col items-center justify-center relative">
                            <img
                                src="/assets/badge.png"
                                alt="Score badge"
                                className="w-28 h-28 md:w-32 md:h-32"
                                 draggable="false"
                                 onDragStart={(e) => e.preventDefault()}
                            />
                            <p className="font-bold text-white text-3xl md:text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                {calculateRating(ratings)}
                            </p>
                        </div>

                        {/* Stars */}
                        <div className="flex justify-center gap-1">
                            {getStars(calculateRating(ratings), "text-lg md:text-xl text-xyellow", false)}
                        </div>

                        {/* Pilihan Tamu */}
                        <div className="text-center">
                            <p className="text-base md:text-lg font-semibold text-gray-600">
                                Pilihan Tamu
                            </p>
                            <p className="text-gray-500 text-xs md:text-sm mt-1">
                                Rumah ini menjadi favorit tamu berdasarkan
                                penilaian, ulasan, dan keandalannya
                            </p>
                        </div>

                        {/* Progress Bars */}
                        <div className="w-full">
                            <p className="font-medium text-gray-600 text-sm mb-3">
                                Nilai Keseluruhan
                            </p>
                            <div className="space-y-2">
                                {[
                                    ["Kebersihan", ratings?.rate_kebersihan ?? 0],
                                    ["Keakuratan", ratings?.rate_keakuratan ?? 0],
                                    ["Check-in", ratings?.rate_checkin ?? 0],
                                    ["Komunikasi", ratings?.rate_komunikasi ?? 0],
                                    ["Lokasi", ratings?.rate_lokasi ?? 0],
                                    ["Nilai Ekonomis", ratings?.rate_nilaiekonomis ?? 0],
                                ].map(([label, value], i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-gray-500 w-8">{value.toFixed(1)}</span>
                                        <progress
                                            className="rating-progress flex-1"
                                            value={value}
                                            max="5"
                                        ></progress>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail Rating */}
                        <div className="divide-y divide-gray-200 text-sm">
                        {[
                            [<Sparkles />, "Kebersihan", ratings?.rate_kebersihan ?? 0],
                            [<MapPin />, "Keakuratan", ratings?.rate_keakuratan ?? 0],
                            [<Key />, "Check-in", ratings?.rate_checkin ?? 0],
                            [<MessageCircle />, "Komunikasi", ratings?.rate_komunikasi ?? 0],
                            [<Map />, "Lokasi", ratings?.rate_lokasi ?? 0],
                            [<Wallet />, "Nilai Ekonomis", ratings?.rate_nilaiekonomis ?? 0],
                        ].map(([icon, label, value], i) => (
                            <div key={i} className="flex items-center justify-between py-3 text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 text-primary-opaque">{icon}</div>
                                <p className="font-medium text-sm md:text-base">{label}</p>
                            </div>
                            <div className="flex items-center">
                                <i className="bi bi-star-fill mr-1 text-yellow-500 text-sm"></i>
                                <span className="font-semibold">{(value ?? 0).toFixed(1)}</span>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE - REVIEWS */}
                    <div className="md:col-span-2 flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                            <p className="text-gray-500 text-base md:text-xl">
                                Semua Ulasan{" "}
                                <span className="font-semibold text-gray-600">
                                    ({filteredReviews.length})
                                </span>
                            </p>
                            <Dropdown
                                options={optionSortByDate}
                                value={orderBy}
                                onChange={setOrderBy}
                                placeholder="Paling Baru"
                            />
                        </div>

                        {/* Search */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    className="w-full rounded-full border border-gray-300 px-4 py-2 pr-10 placeholder:text-sm placeholder:text-gray-500 text-sm md:text-base"
                                    placeholder="Cari Ulasan"
                                    value={search}
                                    onChange={handleSearch}
                                />
                                <i className="bi bi-search absolute top-1/2 -translate-y-1/2 right-4 text-gray-400"></i>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="overflow-y-auto flex-1 pr-1 max-h-[50vh] md:max-h-[60vh]">
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <ReviewCard key={review.id} review={review} />
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-sm mt-10">
                                    Belum ada ulasan tersedia.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
