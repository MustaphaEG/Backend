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
        Schema::create('admin_actions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("id_admin_log");
            $table->foreign("id_admin_log")
                    ->references("id")
                    ->on("admin_logs")
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            $table->unsignedBigInteger("id_user");
            $table->foreign("id_user")
                    ->references("id_user")
                    ->on("admins")
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            $table->char("action_url", 255)->default("");
            $table->text("action_body")->default("");
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
        Schema::dropIfExists('admin_actions');
    }
};
