<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shortened_urls', function (Blueprint $table) {
            $table->id();
            $table->text('original_url');
            $table->string('short_code', 20)->unique();
            $table->unsignedBigInteger('clicks')->default(0);
            $table->timestamps();
            $table->index('short_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shortened_urls');
    }
};
