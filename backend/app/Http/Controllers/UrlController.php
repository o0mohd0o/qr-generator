<?php

namespace App\Http\Controllers;

use App\Models\ShortenedUrl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UrlController extends Controller
{
    /**
     * Shorten a URL and return the shortened version.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function shorten(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $originalUrl = $request->input('url');
        
        // Check if URL already exists in the database
        $existingUrl = ShortenedUrl::where('original_url', $originalUrl)->first();
        
        if ($existingUrl) {
            return response()->json([
                'original_url' => $existingUrl->original_url,
                'short_url' => $existingUrl->getFullShortUrl(),
                'short_code' => $existingUrl->short_code,
                'clicks' => $existingUrl->clicks,
            ]);
        }
        
        // Generate a unique short code
        $shortCode = $this->generateUniqueShortCode();
        
        // Create a new shortened URL record
        $shortenedUrl = ShortenedUrl::create([
            'original_url' => $originalUrl,
            'short_code' => $shortCode,
        ]);
        
        return response()->json([
            'original_url' => $shortenedUrl->original_url,
            'short_url' => $shortenedUrl->getFullShortUrl(),
            'short_code' => $shortenedUrl->short_code,
            'clicks' => $shortenedUrl->clicks,
        ], 201);
    }
    
    /**
     * Redirect to the original URL from a short code.
     *
     * @param string $shortCode
     * @return RedirectResponse
     */
    public function redirect(string $shortCode): RedirectResponse
    {
        $shortenedUrl = ShortenedUrl::where('short_code', $shortCode)->firstOrFail();
        
        // Increment the click count
        $shortenedUrl->incrementClicks();
        
        return redirect()->away($shortenedUrl->original_url);
    }
    
    /**
     * Get URL statistics.
     *
     * @param string $shortCode
     * @return JsonResponse
     */
    public function statistics(string $shortCode): JsonResponse
    {
        $shortenedUrl = ShortenedUrl::where('short_code', $shortCode)->firstOrFail();
        
        return response()->json([
            'original_url' => $shortenedUrl->original_url,
            'short_url' => $shortenedUrl->getFullShortUrl(),
            'short_code' => $shortenedUrl->short_code,
            'clicks' => $shortenedUrl->clicks,
            'created_at' => $shortenedUrl->created_at,
        ]);
    }
    
    /**
     * Generate a unique short code for a URL.
     *
     * @return string
     */
    private function generateUniqueShortCode(): string
    {
        do {
            $shortCode = Str::random(6);
        } while (ShortenedUrl::where('short_code', $shortCode)->exists());
        
        return $shortCode;
    }
}
