<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomRequest extends Model
{
    use HasFactory;

    protected $table = 'custom_requests';

    protected $fillable = [
        'name', 'email', 'phone', 'furniture_type', 'budget', 'dimensions',
        'image', 'description', 'status', 'admin_response',
    ];
}
