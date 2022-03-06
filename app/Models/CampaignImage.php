<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignImage extends Model
{
    use HasFactory;
    protected $primaryKey = 'id_image';
    protected $fillable = [
        'id_campaign',
        'image_name',
        'image_path',
        'updated',
        'last_updated_at',
    ];
    
    protected $casts = [
        'last_updated_at' => 'datetime',
    ];
    
}
