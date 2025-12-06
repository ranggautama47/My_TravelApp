<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Locations;
use App\Models\Categories;
use App\Models\Reviews;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LocationsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $categoryId = $request->query('category');

       $query = Locations::query()
        ->with(['category', 'tickets', 'tickets.category'])
        ->select('locations.*'); // Pilih semua kolom locations

        if ($this->hasRatingColumns()) {
            $query->withAvg('reviews as average_rating', DB::raw('(
                rate_kebersihan + rate_keakuratan + rate_checkin + rate_komunikasi + rate_lokasi + rate_nilaiekonomis
            ) / 6'));
        } else {
            // Jika kolom rating tidak ada, berikan nilai default 0
            $query->withAvg('reviews as average_rating', DB::raw('0'));
        }

        if ($search) {
            $query->where('locations.title', 'like', '%' . $search . '%');
        }

        if ($categoryId) {
            $query->where('locations.category_id', $categoryId);
        }

        $locations = $query->paginate(9)->withQueryString();

        $locations->getCollection()->transform(function ($location) {
            $minPrice = $location->tickets->min('price_per_pack');
            $location->start_from = $minPrice ?? 0;

            // ✅ Tambahkan pembulatan 1 angka di sini:
            $location->average_rating = round($location->average_rating ?? 0, 1);

            return $location;
        });


        $categories = Categories::select('id', 'name')->get();

        return Inertia::render('Location', [
            'locations' => $locations,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
            ],
            'categories' => $categories,
        ]);

}

    public function maps(Request $request)
    {
        $search = $request->query('search');
        $categoryId = $request->query('category');
        $region = $request->query('region');
        $priceRange = $request->query('price_range');
        $order = $request->query('sort');

        $query = Locations::query()
        ->with(['category', 'tickets', 'tickets.category'])
        ->select('locations.*'); // Pilih semua kolom locations

        if ($this->hasRatingColumns()) {
            $query->withAvg('reviews as average_rating', DB::raw('(
                rate_kebersihan + rate_keakuratan + rate_checkin + rate_komunikasi + rate_lokasi + rate_nilaiekonomis
            ) / 6'));
        } else {
            $query->withAvg('reviews as average_rating', DB::raw('0'));
        }

        if ($search) {
            $query->where('locations.title', 'like', '%' . $search . '%');
        }

        if ($categoryId && $categoryId !== 'all') {
            $query->where('locations.category_id', $categoryId);
        }

        if ($region && $region !== 'all') {
            $query->where('locations.region_id', $region);
        }

        if ($priceRange && $priceRange !== 'all') {
            [$minPrice, $maxPrice] = explode('-', $priceRange);

            $query->whereHas('tickets', function ($q) use ($minPrice, $maxPrice) { // ✅ PERBAIKAN: 'tickets' bukan 'ticket'
                if ($minPrice) {
                    $q->where('price_per_pack', '>=', $minPrice);
                }
                if ($maxPrice) {
                    $q->where('price_per_pack', '<=', $maxPrice);
                }
            });
        }

        if ($order === 'asc' || $order === 'desc') {
            $query->joinSub(
                DB::table('location_ticket')
                    ->join('tickets', 'location_ticket.ticket_id', '=', 'tickets.id')
                    ->select('location_ticket.location_id', DB::raw('MIN(tickets.price_per_pack) as min_price'))
                    ->groupBy('location_ticket.location_id'),
                'min_ticket_prices',
                'locations.id',
                '=',
                'min_ticket_prices.location_id'
            )->orderBy('min_ticket_prices.min_price', $order);
        }

        $locations = $query->paginate(9)->withQueryString();

        $locations->getCollection()->transform(function ($location) {
            $minPrice = $location->tickets->min('price_per_pack'); // ✅ PERBAIKAN: 'tickets' bukan 'ticket'
            $location->start_from = $minPrice ?? 0;

            // ✅ Jika tidak ada rating, set default value
            if (!$location->average_rating) {
                $location->average_rating = 0;
            }

            return $location;
        });

        $categories = Categories::select('id', 'name')->get();
        $regions = Region::select('id', 'name')->get();

        return Inertia::render('Maps', [
            'locations' => $locations,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'region' => $region,
                'price_range' => $priceRange,
                'order' => $order,
            ],
            'categories' => $categories,
            'regions' => $regions,
        ]);
    }

   private function hasRatingColumns()
    {
        // Cek struktur tabel reviews
        $columns = DB::getSchemaBuilder()->getColumnListing('reviews');

        $requiredColumns = [
            'rate_kebersihan',
            'rate_keakuratan',
            'rate_checkin',
            'rate_komunikasi',
            'rate_lokasi',
            'rate_nilaiekonomis'
        ];

        foreach ($requiredColumns as $column) {
            if (!in_array($column, $columns)) {
                return false;
            }
        }

        return true;
    }
}
