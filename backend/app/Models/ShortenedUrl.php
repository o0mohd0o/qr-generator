<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShortenedUrl extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'original_url',
        'short_code',
        'clicks',
    ];

    /**
     * Increment the click count for this shortened URL.
     *
     * @return void
     */
    public function incrementClicks(): void
    {
        $this->increment('clicks');
    }

    /**
     * Get the full shortened URL including the domain.
     *
     * @return string
     */
    public function getFullShortUrl(): string
    {
        // Use the COMPANY_DOMAIN environment variable or fallback to app.url
        $domain = env('COMPANY_DOMAIN', 'http://bonlineco.com/');
        return $domain . $this->short_code;
    }
}
