<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ticket_categories';

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'name',
    ];

    public function tickets()
    {
         return $this->hasMany(Ticket::class, 'ticket_category_id');
    }
}
