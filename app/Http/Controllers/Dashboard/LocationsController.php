<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Models\Locations;
use App\Models\Region;
use App\Models\Categories;
use App\Models\Ticket;

class LocationsController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:locations index', only: ['index']),
            new Middleware('permission:locations create', only: ['create', 'store']),
            new Middleware('permission:locations edit', only: ['edit', 'update']),
            new Middleware('permission:locations delete', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $locations = Locations::with(['category', 'tickets'])
            ->when($request->search, fn($query) => $query->where('title', 'like', '%'. $request->search. '%'))
            ->orderBy('title', 'ASC')
            ->paginate(5);

        return inertia('Locations/Index', [
            'locations' => $locations,
            'filters' => $request->only(['search'])
            
        ]);


    }

    public function create()
    {
        $categories = Categories::orderBy('name', 'ASC')->get();
        $tickets = Ticket::select('id', 'ticket_code', 'name', 'price_per_pack', 'ticket_category_id')
        ->with('category')
        ->orderByRaw('CAST(SUBSTRING_INDEX(ticket_code, "T", -1) AS UNSIGNED) ASC')
        ->get()
        ->groupBy( function ($tickets){
            return $tickets->category->name ?? "Uncategorized";
        });

         $regions = Region::select('id', 'name')->get();   //ORM Laravel -> Select id, name From region

        return inertia('Locations/Create', [
            'categories' => $categories,
            'tickets' => $tickets,
            'regions' => $regions,
        ]);
    }

       public function store(Request $request)
{
    // ✅ Validasi input
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'officehours' => 'required|string',
        'category_id' => 'required|exists:categories,id',
        'ticket_ids' => 'required|array|min:1',
        'ticket_ids.*' => 'exists:tickets,id',
        'region_id' => 'required|exists:regions,id',
        'phone' => 'required|string',
        'address' => 'required|string',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'image' => 'required|array|min:1',
        'image.*' => 'image|mimes:jpg,jpeg,png|max:2560',
    ], [
        'image.required' => 'Please upload at least one image.',
        'image.*.image' => 'Each file must be an image.',
        'ticket_ids.required' => 'Please select at least one ticket.',
    ]);

    $imagePaths = [];

    // ✅ Upload semua gambar ke storage/app/public/images
    if ($request->hasFile('image')) {
        foreach ($request->file('image') as $imageFile) {
            $path = $imageFile->store('images', 'public');
            $imagePaths[] = $path;
        }
    }

    // ✅ Simpan ke tabel locations
    $location = Locations::create([
        'title' => $validated['title'],
        'description' => $validated['description'],
        'officehours' => $validated['officehours'],
        'category_id' => $validated['category_id'],
        'region_id' => $validated['region_id'],
        'phone' => $validated['phone'],
        'address' => $validated['address'],
        'latitude' => $validated['latitude'],
        'longitude' => $validated['longitude'],
        'image' => implode('|', $imagePaths), // "img1|img2|img3"
    ]);

    $ticketIds = $validated['ticket_ids'];

    $syncData = [];
    foreach ($ticketIds as $ticketId) {
        $ticket = Ticket::find($ticketId);
        if ($ticket) {
            $syncData[$ticket->id] = ['ticket_category_id' => $ticket->ticket_category_id];
        }
    }

    $location->tickets()->attach($syncData);

    return redirect()->route('locations.index')
        ->with('success', 'Location created successfully!');
}


    public function edit(Locations $location)
    {
        $categories = Categories::orderBy('name', 'ASC')->get();

        // ✅ PERBAIKAN: Tambah price_per_pack di select
        $tickets = Ticket::select('id', 'ticket_code', 'name', 'price_per_pack', 'ticket_category_id')
            ->with('category')
            ->orderByRaw('CAST(SUBSTRING_INDEX(ticket_code, "T", -1) AS UNSIGNED) ASC')
            ->get()
            ->groupBy(function ($ticket) {
                return $ticket->category->name ?? "Uncategorized";
            });

        $regions = Region::select('id', 'name')->get();

        // ✅ Load relasi ticket yang sudah terhubung
        $location->load('tickets.category');

        return inertia('Locations/Edit', [
            'location' => $location,
            'categories' => $categories,
            'tickets' => $tickets,
            'regions' => $regions,
        ]);
    }

   public function update(Request $request, Locations $location)
    {
        // ✅ PERBAIKAN: Image jadi nullable (optional)
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'officehours' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'ticket_ids' => 'required|array|min:1',
            'ticket_ids.*' => 'exists:tickets,id',
            'region_id' => 'required|exists:regions,id',
            'phone' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'image' => 'nullable|array',
            'image.*' => 'image|mimes:jpg,jpeg,png|max:2560',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'officehours' => $validated['officehours'],
            'category_id' => $validated['category_id'],
            'region_id' => $validated['region_id'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ];

        // ✅ Hanya update gambar jika ada upload baru
        if ($request->hasFile('image')) {
            // Hapus gambar lama
            if ($location->image) {
                $oldImages = explode('|', $location->image);
                foreach ($oldImages as $oldImage) {
                    if (Storage::disk('public')->exists($oldImage)) {
                        Storage::disk('public')->delete($oldImage);
                    }
                }
            }

            $newImagePaths = [];
            // Upload gambar baru
            foreach ($request->file('image') as $imageFile) {
                $path = $imageFile->store('images', 'public');
                $newImagePaths[] = $path;
            }
            $updateData['image'] = implode('|', $newImagePaths);
        }

        // Update location
        $location->update($updateData);

        // ✅ PERBAIKAN: Ganti ticket() menjadi tickets()
        $ticketIds = $validated['ticket_ids'];
        $location->tickets()->detach(); // ✅ tickets() bukan ticket()

        foreach ($ticketIds as $ticketId) {
            $ticket = Ticket::find($ticketId);
            if ($ticket && $ticket->ticket_category_id) {
                $location->tickets()->attach($ticket->id, [ // ✅ tickets() bukan ticket()
                    'ticket_category_id' => $ticket->ticket_category_id
                ]);
            }
        }

        return redirect()->route('locations.index')
            ->with('success', 'Location updated successfully!');
    }

    public function destroy(Locations $location)
    {
        if ($location->image) {
            $images = explode('|', $location->image);
            foreach ($images as $image) {
                if (Storage::disk('public')->exists($image)) {
                    Storage::disk('public')->delete($image);
                }
            }
        }

        $location->delete();
        return back();
    }
}
