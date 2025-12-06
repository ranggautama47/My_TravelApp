<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Region extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name'];

    //  tambahkan dates untuk deleted_at
    protected $dates = ['deleted_at'];
    public function location()
    {
        return $this->hasMany(Locations::class);
    }
}
