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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
            $table->text('review')->nullable();
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->integer('rate_kebersihan');
            $table->integer('rate_keakuratan');
            $table->integer('rate_checkin');
            $table->integer('rate_komunikasi');
            $table->integer('rate_lokasi');
            $table->integer('rate_nilaiekonomis');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
