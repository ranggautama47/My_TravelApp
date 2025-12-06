<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationTickets extends Model
{
    protected $table = 'location_ticket';
    protected $fillable =[
        'location_id',
        'ticket_id',
        'ticket_category_id',
    ];

    public function location() {
        return $this->belongsTo(Locations::class);
    }

    public function ticket() {
        return $this->belongsTo(Ticket::class);
    }

    public function category() {
        return $this->belongsTo(TicketCategory::class, 'ticket_category_id');
    }
}
