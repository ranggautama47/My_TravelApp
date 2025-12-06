import { getStars, formatDate, calculateRating } from "@/Utils/helper";

export default function ReviewCard({ review }) {
    // Validasi review data
    if (!review) {
        return (
            <div className="border-b border-gray-200 pb-6 mb-6">
                <p className="text-gray-500">Review data not available</p>
            </div>
        );
    }

    return (
        <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex gap-5 items-center">
                <img
                    src={review.user?.profile_picture || "/assets/profile_placeholder.webp"}
                    alt={review.user?.name || "User"}
                    className="aspect-square rounded-full object-cover w-12 h-12"
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                />
                <p className="font-semibold text-gray-600">
                    {review.user?.name || "Anonymous User"}
                </p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-gray-400 font-medium text-sm">
                <div className="flex items-center gap-1">
                    {getStars(calculateRating(review))}
                </div>
                <span> ● {formatDate(review.created_at)}</span>
            </div>
            <p className="text-gray-500 mt-4">
                {review.review || "No review text provided"}
            </p>
        </div>
    );
}
