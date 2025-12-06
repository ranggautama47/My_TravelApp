// DestinationCard.jsx
import { router } from "@inertiajs/react";
import { categoryColors } from "@/Utils/Constants";
import { toIDR } from "@/Utils/helper"

export default function DestinationCard({ item, action }) {
    const handleClick = () => {
        if (typeof action === "function") {
            action();
        } else {
            // ✅ Ubah sesuai route yang ada di Laravel
            router.get(route("location.detail", item.id)); // Ganti dengan route yang benar
        }
    };

    return (
        <div
            className="p-2.5 rounded-3xl border border-gray-300 bg-white hover:cursor-pointer hover:shadow-lg transition-all"
            onClick={handleClick}
        >
            <div className="relative">
                <img
                    src={item.image_urls?.[0] || '/default-image.jpg'}  // ✅ Tambahkan fallback
                    alt={item.title}
                    className="w-full rounded-2xl overflow-hidden aspect-video object-cover"
                />
                <p
                   className={`text-sm text-white font-semibold px-5 py-2.5 rounded-full w-fit absolute bottom-4 left-4 ${
                        categoryColors[item.category?.id] || "bg-gray-400"
                  }`}
                  >
                    {item.category?.name || "Tanpa Kategori"}
                </p>

                <p className="text-sm text-white font-semibold px-5 py-2.5 rounded-full bg-xyellow w-fit absolute bottom-4 right-4">
                    <i className="bi bi-star-fill"></i>{" "}
                    <span>{item.average_rating  || "-"}</span>
                </p>
            </div>
            <div className="px-2.5 pb-8">
                <div className="flex justify-between items-end mt-5 text-lg font-semibold">
                    <p>{item.title}</p>
                    <p className="text-primary-opaque text-right">
                        {toIDR(item.start_from)}
                    </p>
                </div>
                <div className="mt-3 text-sm text-gray-400 flex items-center gap-2 font-semibold">
                    <i className="bi bi-clock-fill"></i>
                    <p>{item.officehours}</p>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-wrap line-clamp-2 text-sm text-gray-400 font-medium"
                    dangerouslySetInnerHTML={{__html: item.description }}
                >
                </p>
            </div>
        </div>
    );
}
