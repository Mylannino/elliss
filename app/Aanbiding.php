<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Aanbiding extends Model
{
    protected $fillable = [
        'van', 'tot', 'waar', 'wat'
    ];

    public function products(){
        return $this->belongsToMany('App\Product');
    }
}
