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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('title',255);
            $table->text('image');
            $table->text('description');
            $table->string('officehours',255);
            $table->string('phone',255);
            $table->string('address',255);
            $table->decimal('latitude',10, 6);
            $table->decimal('longitude',10, 6);
            $table->foreignId('category_id',)->constrained('categories')->onDelete('cascade');
            $table->foreignId('region_id')
                  ->nullable()
                  ->constrained('regions')
                  ->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
