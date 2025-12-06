<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Locations extends Model
{
    use HasFactory;

    protected $table = 'locations';
    protected $fillable =[
        "image",
        "title",
        "description",
        "officehours",
        "category_id",
        "region_id",
        "phone",
        "address",
        "latitude",
        "longitude",
    ];

    //tambahkan gambar otomatis
    protected $appends = ['image_urls'];

    // accessor untuk mutiple image(
    public function getImageUrlsAttribute()
    {
        // jika image kosong, return array kosong
        if (!$this->image) {
            return [];
        }

        // pisahkan berdasarkan '\' lalu diubah jadi url storage
        return array_map (function ($image) {
            return asset('storage/' . $image);
        }, explode('|', $this->image));
    }

    public function category()
{
   return $this->belongsTo(Categories::class, 'category_id');
}

    public function tickets()
{
    return $this->belongsToMany(Ticket::class, 'location_ticket', 'location_id', 'ticket_id')
        ->withPivot('ticket_category_id')
        ->withTimestamps();
}

    public function reviews()
    {
        return $this->hasMany(Reviews::class, 'location_id', 'id');
    }
    public function getTicketsGroupedByCategory()
{
    return $this->tickets->groupBy(function ($ticket) {
        return $ticket->pivot->ticket_category_id;
    });
}


    public function region()
    {
        return $this->belongsTo(Region::class);
    }
}

