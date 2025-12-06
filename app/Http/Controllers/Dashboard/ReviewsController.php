<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Locations;
use App\Models\Reviews;

class ReviewsController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:reviews index', only: ['index']),
            new Middleware('permission:reviews create', only: ['create', 'store']),
            new Middleware('permission:reviews edit', only: ['edit', 'update']),
            new Middleware('permission:reviews delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        // Jika bukan admin, batasi hanya review milik user yang sedang login
        $reviews = Reviews::with(['user', 'location', 'transaction'])
            ->when(!$user->hasRole('admin'), fn($q) => $q->where('user_id', $user->id))
            ->when($request->search, fn($q, $search) => $q->where('review', 'like', "%{$search}%"))
            ->latest()
            ->paginate(6)
            ->withQueryString();

        return inertia('Reviews/Index', [
            'reviews' => $reviews,
            'filters' => $request->only(['search']),
            'can' => [
                'create' => $request->user()->can('reviews create'),
                'edit' => $request->user()->can('reviews edit'),
                'delete' => $request->user()->can('reviews delete'),
            ],
        ]);
    }

    public function create()
    {
        $transactions = Transaction::with('location')
            ->where('user_id', auth()->id())
            ->where('payment_status', 'PAID')
            ->get();

        return inertia('Reviews/Create', [
            'transactions' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'review' => 'required|string|max:1000',
            'rate_kebersihan' => 'required|integer|min:1|max:5',
            'rate_keakuratan' => 'required|integer|min:1|max:5',
            'rate_checkin' => 'required|integer|min:1|max:5',
            'rate_komunikasi' => 'required|integer|min:1|max:5',
            'rate_lokasi' => 'required|integer|min:1|max:5',
            'rate_nilaiekonomis' => 'required|integer|min:1|max:5',
        ]);

        $transaction = Transaction::findOrFail($request->transaction_id);

        Reviews::create([
            'user_id' => auth()->id(),
            'transaction_id' => $request->transaction_id,
            'location_id' => $transaction->location_id,
            'review' => $request->review,
            'rate_kebersihan' => $request->rate_kebersihan,
            'rate_keakuratan' => $request->rate_keakuratan,
            'rate_checkin' => $request->rate_checkin,
            'rate_komunikasi' => $request->rate_komunikasi,
            'rate_lokasi' => $request->rate_lokasi,
            'rate_nilaiekonomis' => $request->rate_nilaiekonomis,
        ]);

        return to_route('reviews.index')->with('success', 'Review berhasil ditambahkan.');
    }

    public function edit(Reviews $review)
    {
        if (!auth()->user()->hasRole('admin') && $review->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $locations = Locations::all();
        $transactions = Transaction::all();

        return inertia('Reviews/Edit', [
            'review' => $review,
            'locations' => $locations,
            'transactions' => $transactions,
        ]);
    }

    public function update(Request $request, Reviews $review)
    {
        if (!auth()->user()->hasRole('admin') && $review->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'review' => 'required|string|max:1000',
            'rate_kebersihan' => 'required|integer|min:1|max:5',
            'rate_keakuratan' => 'required|integer|min:1|max:5',
            'rate_checkin' => 'required|integer|min:1|max:5',
            'rate_komunikasi' => 'required|integer|min:1|max:5',
            'rate_lokasi' => 'required|integer|min:1|max:5',
            'rate_nilaiekonomis' => 'required|integer|min:1|max:5',
        ]);

        $review->update([
            'transaction_id' => $request->transaction_id,
            'review' => $request->review,
            'rate_kebersihan' => $request->rate_kebersihan,
            'rate_keakuratan' => $request->rate_keakuratan,
            'rate_checkin' => $request->rate_checkin,
            'rate_komunikasi' => $request->rate_komunikasi,
            'rate_lokasi' => $request->rate_lokasi,
            'rate_nilaiekonomis' => $request->rate_nilaiekonomis,
        ]);

        return to_route('reviews.index')->with('success', 'Review berhasil diperbarui.');
    }

    public function destroy(Reviews $review)
    {
        if (!auth()->user()->hasRole('admin') && $review->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $review->delete();

        return back()->with('success', 'Review berhasil dihapus.');
    }

    /**
     * Debug helper: return reviews for a specific user as JSON.
     * Accessible only to the user themself or admins.
     */
    public function debugUserReviews($userId)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        if ($user->id != (int) $userId && !$user->hasRole('admin')) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $reviews = Reviews::with(['user', 'location', 'transaction'])
            ->where('user_id', $userId)
            ->get();

        return response()->json([
            'success' => true,
            'count' => $reviews->count(),
            'data' => $reviews,
        ]);
    }
}
