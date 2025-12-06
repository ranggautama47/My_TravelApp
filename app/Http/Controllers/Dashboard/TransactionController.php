<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:transactions index', only: ['index']),
        ];
    }

    public function index(Request $request)
    {
        $user = Auth::user();

        $transactions = Transaction::query()
            ->with(['user', 'ticket'])
            ->when(!$user->hasRole('admin'), fn($q) => $q->where('user_id', $user->id))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->input('search');
                $q->where(function ($sub) use ($search) {
                    $sub->where('code', 'like', "%{$search}%")
                        ->orWhere('payment_method', 'like', "%{$search}%")
                        ->orWhere('payment_status', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(5)
            ->withQueryString();

        // 🔥 Ini memastikan data dari database terbaru
        $transactions->setCollection(
            $transactions->getCollection()->map(function ($transaction) {
                $transaction->refresh();
                return $transaction->load(['user', 'ticket']);
            })
        );

        return inertia('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search']),
        ]);
    }

}
