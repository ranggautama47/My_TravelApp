<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class TicketController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:tickets index', only: ['index']),
            new Middleware('permission:tickets create', only: ['create', 'store']),
            new Middleware('permission:tickets edit', only: ['edit', 'update']),
            new Middleware('permission:tickets delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $tickets = Ticket::select('id', 'ticket_code', 'name', 'price_per_pack', 'qty')
            ->when($request->search, fn($query) => $query->where('ticket_code', 'like', '%'.$request->search.'%'))
            ->latest()
            ->paginate(5)
            ->withQueryString();

        // konversi path gambar ke url agar bisa ditampilkan di tabel
        foreach ($tickets as $ticket) {
            $ticket->image_url = $ticket->image ? asset('storage/'. $ticket->image) : null;
        }

        return inertia('Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $ticketCategories = TicketCategory::select('id', 'name')->get();
        return inertia('Tickets/Create', [
             'categories' => $ticketCategories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ticket_category_id' => 'required|exists:ticket_categories,id',
            'price_per_pack' => 'required|integer|min:0',
            'qty' => 'required|integer|min:1'
        ]);

        $ticketCategory = TicketCategory::findOrFail($request->ticket_category_id);
        Ticket::create([
            'ticket_code' => 'T'. mt_rand(1000, 9999), // T + 0001 = T0001
            'name' => $ticketCategory->name,
            'ticket_category_id' => $ticketCategory->id,
            'price_per_pack' => $request->price_per_pack,
            'qty' => $request->qty,
        ]);

        return to_route('tickets.index')->with('success', 'Ticket berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        $ticketCategories = TicketCategory::select('id', 'name')->get();
        return inertia('Tickets/Edit', [
            'ticket' => $ticket,
             'categories' => $ticketCategories,
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'ticket_category_id' => 'required|exists:ticket_categories,id',
            'price_per_pack' => 'required|integer|min:0',
            'qty' => 'required|integer|min:1'
        ]);

        $ticketCategory = TicketCategory::findOrFail($request->ticket_category_id);

        $ticket->update([
            'name' => $ticketCategory->name, 
            'ticket_category_id' => $ticketCategory->id,
            'price_per_pack' => $request->price_per_pack,
            'qty' => $request->qty,
        ]);

        return to_route('tickets.index')->with('success', 'Ticket berhasil diperbaiki');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return back()->with('success', 'Ticket berhasil dihapus.');
    }
}
