<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('brand_category', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("id_brand");
            $table->unsignedBigInteger("id_category");
            $table->foreign("id_brand")
                    ->references("id_brand")
                    ->on("brands")
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            $table->foreign("id_category")
                    ->references("id_category")
                    ->on("categories")
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("brand_category");
    }
};
