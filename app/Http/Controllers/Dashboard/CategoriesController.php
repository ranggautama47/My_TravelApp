<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\Categories;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CategoriesController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware("permission:categories index", only: ["index"]),
            new Middleware("permission:categories create", only: ["create", "store"]),
            new Middleware("permission:categories edit", only: ["edit", "update"]),
            new Middleware("permission:categories delete", only: ["destroy"]),
        ];
    }
    public function index(Request $request)
    {
        $categories = Categories::select("id", "name", "image")
            ->when(
                $request->search,
                fn($query) =>
                $query->where("name", "like", "%" . $request->search . "%")
            )
            ->orderBy("name", "ASC")
            ->paginate(10)
            ->withQueryString();

        // konversi path gambar ke URL agar bisa di tampilkan di tabel
        // filename.jpg (panjangnya localhost:8000/storage/categories/filename.jpg)
        foreach ($categories as $category) {
            $category->image_url = $category->image
                ? asset("storage/" . $category->image)
                : null;
        }
        // if else dari laravel seperti yang di atas kalau tidak adda image maka terisi null

        return inertia("Categories/Index", [
            "categories" => $categories,
            "filters" => $request->only(["search"]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Categories/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        "name" => "required|min:3|max:255|unique:categories,name",
        "image" => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048",
    ]);

    // Upload image (jika ada)
    $imagePath = $request->hasFile("image")
        ? $request->file("image")->store("categories", "public")
        : null;

    Categories::create([
        "name" => $request->name,
        "image" => $imagePath,
    ]);

    return to_route("categories.index")->with("success", "Kategori berhasil ditambahkan.");
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categories $category)
    {
        return inertia("Categories/Edit", ["category" => $category]);
    }


   public function update(Request $request, Categories $category)
{
    Log::info('=== UPDATE CATEGORY START ===');
    Log::info('Request Method: ' . $request->method());
    Log::info('Request Headers: ', $request->headers->all());
    Log::info('Request All Data: ', $request->all());
    Log::info('Request Input: ', $request->input());
    Log::info('Request Files: ', $request->file() ?: ['no files']);
    Log::info('Category ID: ' . $category->id);

    $request->validate([
        'name' => 'required|string|min:3|max:255|unique:categories,name,' . $category->id,
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
    ]);

    $updateData = ['name' => $request->name];

    // Jika ada gambar baru
    if ($request->hasFile('image')) {
        Log::info('New image uploaded', ['old_image' => $category->image]);

        // Hapus gambar lama jika ada
        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
            Log::info('Old image deleted');
        }

        // Upload gambar baru
        $imagePath = $request->file('image')->store('categories', 'public');
        $updateData['image'] = $imagePath;

        Log::info('New image path', ['path' => $imagePath]);
    } else {
        Log::info('No new image uploaded, keep old');
    }

    $category->update($updateData);

    Log::info('=== UPDATE CATEGORY END ===');
    return to_route("categories.index")->with("success", "Kategori berhasil diperbarui!");
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categories $category)
    {
         if ($category->image && Storage::disk('public')->exists($category->image)) {
        Storage::disk('public')->delete($category->image);
        Log::info('Category image deleted', ['path' => $category->image]);
    }

        $category->delete();

        return back()->with("success", "Kategori berhasil dihapus.");
    }
}
