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
        Schema::create('admins', function (Blueprint $table) {
            $table->id("id_user");
            $table->foreign("id_user")->references("id_user")
                    ->on("users")
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            $table->enum("user_group", [config("const.UserGroup.UG_USER"), config("const.UserGroup.UG_SUPERVISOR"), config("const.UserGroup.UG_ADMIN")]);
            $table->dateTime("last_seen");
            $table->dateTime("last_succ_log");
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
        Schema::dropIfExists('admins');
    }
};
