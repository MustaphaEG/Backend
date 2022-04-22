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
         Schema::create('categories', function (Blueprint $table) {
            $table->id("id_category");
            $table->char("category_icon",  255)->default("defualt/icon.png");
            $table->char("category_title", 255)->default("Category Title");
            $table->char("category_img",   255)->default("defualt/icon.png");
            $table->char("category_desc",  255)->default("Category Desc");
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
        Schema::dropIfExists("categories");
    }
};
