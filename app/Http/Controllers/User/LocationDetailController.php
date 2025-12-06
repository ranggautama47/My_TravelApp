<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Locations;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LocationDetailController extends Controller
{
    public function index($id)
    {
        $location = Locations::with(['category', 'tickets', 'reviews.user'])->findOrFail($id);

        $ratingFields = [
            'rate_kebersihan',
            'rate_keakuratan',
            'rate_checkin',
            'rate_komunikasi',
            'rate_lokasi',
            'rate_nilaiekonomis',
        ];

        $reviews = $location->reviews;
        $totalReviews = $reviews->count();
        $ratingAverages = [];

        foreach ($ratingFields as $field) {
            $sum = $reviews->sum($field);
            $ratingAverages[$field] = $totalReviews > 0 ? round($sum / $totalReviews, 2) : 0;
        }
        // Hitung average_rating keseluruhan
        $ratingSum = collect($ratingAverages)->sum();
        $location->average_rating = count($ratingFields) > 0 ? round($ratingSum / count($ratingFields), 1) : 0;

        // Ambil semua kategori tiket unik berdasarkan kolom ticket_category_id
       $ticketCategories = TicketCategory::whereIn(
            'id',
            optional($location->tickets)->pluck('pivot.ticket_category_id')->unique() ?? []
        )->get();

        $minPrice = $location->tickets->min('price_per_pack');
        $location->start_from = $minPrice ?? 0;


        return Inertia::render('Details', [
            'location' => $location,
            'ratingAverages' => $ratingAverages, // ✅ disamakan ejaan dengan React
            'ticketCategories' => $ticketCategories,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }
}
