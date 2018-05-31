<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $timestamps = false;

    public function users(){
        return $this->belongsToMany('App\User');
    }

    public function aanbidings(){
        return $this->belongsToMany('App\Aanbiding');
    }

    public function merk()
    {
       return $this->hasOne('App\Merk');
    }
}
