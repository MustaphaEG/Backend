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
        Schema::create('category_product', function (Blueprint $table) {
            
            $table->id();
            $table->unsignedBigInteger("id_product");
            $table->unsignedBigInteger("id_category");
            $table->foreign("id_product")
                    ->references("id_product")
                    ->on("products")
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
        //
    }
};
