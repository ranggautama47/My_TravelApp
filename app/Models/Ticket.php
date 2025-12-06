<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;
    protected $table ='tickets';
    protected $fillable = [
        'ticket_code',
        'name',
        'ticket_category_id',
        'price_per_pack',
        'qty'
    ];

    public function category()
    {
        return $this->belongsTo(TicketCategory::class, 'ticket_category_id');
    }

   public function location()
    {
        return $this->belongsToMany(Locations::class, 'location_ticket')
                    ->withPivot('ticket_category_id')
                    ->withTimestamps();
    }

    public function ticketCategory()
    {
        return $this->belongsTo(TicketCategory::class, 'ticket_category_id');
    }
}
