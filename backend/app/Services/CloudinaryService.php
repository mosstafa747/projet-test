<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    protected $cloudinary;

    public function __construct()
    {
        $url = env('CLOUDINARY_URL');
        if ($url) {
            $this->cloudinary = new Cloudinary(
                Configuration::instance($url)
            );
        }
    }

    public function upload($file, $folder = 'products')
    {
        if (!$file || !$this->cloudinary) return $file; // Return original if service not configured

        try {
            $response = $this->cloudinary->uploadApi()->upload($file, [
                'folder' => 'beldi/' . $folder,
                'transformation' => [
                    ['width' => 1000, 'crop' => 'limit', 'quality' => 'auto', 'fetch_format' => 'auto']
                ]
            ]);
            return $response['secure_url'];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Cloudinary Upload Error: ' . $e->getMessage());
            return $file;
        }
    }

    public function delete($url)
    {
        if (!$url || !$this->cloudinary) return;
        
        try {
            $path = parse_url($url, PHP_URL_PATH);
            $parts = explode('/', $path);
            $filename = end($parts);
            $publicId = 'beldi/products/' . explode('.', $filename)[0];
            
            $this->cloudinary->uploadApi()->destroy($publicId);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Cloudinary Delete Error: ' . $e->getMessage());
        }
    }
}
