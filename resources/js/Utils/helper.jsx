import { Key } from "lucide-react";

export const getStars = (rating, customClass = "", showEmptyStar = true) => {
    const stars = [];
    const whole = Math.floor(rating);
    const decimal = rating - whole;

    let adjusted = whole;

    if (decimal >= 0.7) {
        adjusted = whole + 1;
    } else if (decimal >= 0.4) {
        adjusted = whole + 0.5;
    }

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(adjusted)) {
            stars.push(
                <i
                    key={i}
                    className={`bi bi-star-fill text-yellow-500 ${customClass}`}
                />,
            );
        } else if (i - adjusted === 0.5) {
            stars.push(
                <i
                    key={i}
                    className={`bi bi-star-half text-yellow-500 ${customClass}`}
                />,
            );
        } else {
            if (showEmptyStar) {
                stars.push(
                    <i
                        key={i}
                        className={`bi bi-star text-gray-400 ${customClass}`}
                    />,
                );
            }
        }
    }

    return stars; // ✅ PERBAIKAN: huruf kecil "stars"
};

export const formatDate = (rawDate) => {
    // Validasi input
    if (!rawDate) {
        return "No date";
    }

    try {
        const dateObj = new Date(rawDate);

        // Cek jika date valid
        if (isNaN(dateObj.getTime())) {
            return "Invalid date";
        }

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(dateObj);
    } catch (error) {
        console.error("Error formatting date:", error, rawDate);
        return "Date error";
    }
};

export const toIDR = (value) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

export const calculateRating = (review) => {
  if (!review) return 0;
  
  const ratingKeys = [
    "rate_kebersihan",
    "rate_keakuratan",
    "rate_checkin",
    "rate_komunikasi",
    "rate_lokasi",
    "rate_nilaiekonomis",
  ];

    // Ambil nilai rating dari setiap field
    const values = ratingKeys.map((key) => review[key] || 0);

    // Hitung rata-rata
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;

    return parseFloat(average.toFixed(1));
};

