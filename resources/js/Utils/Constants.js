export const optionsPriceRanges = [
    {
        label: "All Price",
        value: "all",
    },
    {
        label: "Di bawah Rp100.000",
        value: "0-100000",
    },
    {
        label: "Rp100.000 - Rp1.000.000",
        value: "100000-1000000",
    },
    {
        label: "Di atas Rp1.000.000",
        value: "1000000-999999999",
    },
];

export const optionsSorts = [
    {
        label: "Harga Terendah",
        value: "asc",
    },
    {
        label: "Harga Tertinggi",
        value: "desc",
    },
];

export const optionSortByDate = [
    {
        label: "Paling Baru",
        value: "newest",
    },
    {
        label: "Paling Lama",
        value: "oldest",
    },
];

export const categories = [
    {
        thumbnail: "/assets/category_mountain.svg",
        name: "Mountains",
        color: "bg-xgreen",
    },
    {
        thumbnail: "/assets/category_beach.svg",
        name: "Beaches",
        color: "bg-xorange",
    },
    {
        thumbnail: "/assets/category_shop.svg",
        name: "Shop & Market",
        color: "bg-xgray",
    },
    {
        thumbnail: "/assets/category_history.svg",
        name: "History & Education",
        color: "bg-xpurple",
    },
    {
        thumbnail: "/assets/category_artculture.svg",
        name: "Art & Culture",
        color: "bg-xred",
    },
    {
        thumbnail: "/assets/category_themepark.svg",
        name: "Theme Park",
        color: "bg-xdarkgreen",
    },
];

export const categoryColors = {
    1: "bg-xgreen",
    2: "bg-xorange",
    3: "bg-xgray",
    4: "bg-xpurple",
    5: "bg-xred",
    6: "bg-xdarkgreen",
};

export const ratingTypes = [
    {
        key: "rate_checkin",
        label: "Check in",
    },
    { key: "rate_lokasi", label: "Lokasi" },
    { key: "rate_kebersihan", label: "Kebersihan" },
    { key: "rate_komunikasi", label: "Komunikasi" },
    { key: "rate_keakuratan", label: "Akurasi" },
    {
        key: "rate_nilaiekonomis",
        label: "Nilai Ekonomis",
    },
];
