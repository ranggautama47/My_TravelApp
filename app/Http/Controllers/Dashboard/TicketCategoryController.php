<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\TicketCategory;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;

class TicketCategoryController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware("permission:tickets index", only: ["index"]),
            new Middleware("permission:tickets create", only: ["create", "store"]),
            new Middleware("permission:tickets edit", only: ["edit", "update"]),
            new Middleware("permission:tickets delete", only: ["destroy"]),
        ];
    }

    public function index(Request $request)
    {
        $ticketCategories = TicketCategory::select('id', 'name')
            
            ->when($request->search, fn($query) =>
                $query->where('name', 'like', '%'.$request->search.'%')
            )
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

           // SELECT id, name FROM ticket_categories
           // id name
           // 1 VIP
           // 2 Reguler
           return inertia('TicketCategories/Index', [
                'ticketCategories' => $ticketCategories,
                'filter' =>$request->only(['search'])
           ]);
    }

    public function create()
    {
        return inertia('TicketCategories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|max:255|unique:ticket_categories,name,NULL,id,deleted_at,NULL',
        ]);

        TicketCategory::create([
            'name' => $request->name,
        ]);

        return to_route('ticket-categories.index')->with('success', 'Ticket category berhasil ditambahkan.');

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TicketCategory $ticketCategory)
    {
        return inertia('TicketCategories/Edit', ['ticketCategory' => $ticketCategory]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TicketCategory $ticketCategory)
    {
        $request->validate([
            'name' => 'required|min:3|max:255|unique:ticket_categories,name,' . $ticketCategory->id . ',id,deleted_at,NULL',
        ]);

         $ticketCategory->update([
            'name' => $request->name,
    ]);

        return to_route('ticket-categories.index')->with('success', 'Ticket category berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketCategory $ticketCategory)
    {
        $ticketCategory->delete();

        return back()->with('Succes', 'Ticket category berhasil dihapus.');
    }
}
