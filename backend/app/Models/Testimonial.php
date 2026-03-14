<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = ['author_name', 'author_title', 'content', 'rating', 'avatar', 'featured'];

    protected function casts(): array
    {
        return ['featured' => 'boolean'];
    }
}
