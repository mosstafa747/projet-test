<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        Testimonial::insert([
            ['author_name' => 'Sophie M.', 'author_title' => 'Interior Designer', 'content' => 'The quality and craftsmanship are exceptional. Our clients are always delighted with Beldi pieces.', 'rating' => 5, 'featured' => true, 'created_at' => now(), 'updated_at' => now()],
            ['author_name' => 'James L.', 'author_title' => 'Homeowner', 'content' => 'We ordered a custom dining table. The team was professional and the result exceeded our expectations.', 'rating' => 5, 'featured' => true, 'created_at' => now(), 'updated_at' => now()],
            ['author_name' => 'Amira K.', 'author_title' => 'Luxury collector', 'content' => 'Authentic Moroccan craftsmanship with a modern sensibility. A true investment in beauty.', 'rating' => 5, 'featured' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
