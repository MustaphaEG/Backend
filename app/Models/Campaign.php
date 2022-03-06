<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;
    protected $primaryKey = 'id_campaign';
    protected $fillable = [
        'id_user',
        'budget_total',
        'budget_daily',
        'date_from',
        'date_to',
    ];
    
    protected $casts = [
        'last_updated_at' => 'datetime',
    ];
    
    
    
}
