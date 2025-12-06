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
        Schema::create('location_ticket', function (Blueprint $table) {
            $table->id();
           $table->foreignId('location_id')->constrained('locations')->onDelete('cascade'); //VIP, Reguler
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('ticket_category_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    // Bromo | 20000 | VIP          1  1   1
    // Bromo | 20000 | Reguler      1  2   2
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('location_ticket');
    }
};
