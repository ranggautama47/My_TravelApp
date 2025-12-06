<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reviews extends Model
{
    use HasFactory;
    protected $table = 'reviews';
    protected $fillable = [
        'user_id',
        'location_id',
        'transaction_id',
        'review',
        'rate_kebersihan',
        'rate_keakuratan',
        'rate_checkin',
        'rate_komunikasi',
        'rate_lokasi',
        'rate_nilaiekonomis'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function location()
    {
        return $this->belongsTo(Locations::class, 'location_id');
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }
}
