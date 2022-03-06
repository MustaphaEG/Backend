<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        
        Schema::create('users', function (Blueprint $table) {
            
            $table->id("id_user");
            $table->string('name')->collation("utf8mb4_general_ci")->charset("utf8mb4");
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            
        });

        Schema::create('campaigns', function (Blueprint $table) {
            
            $table->id("id_campaign");
            $table->unsignedBigInteger('id_user');
            $table->foreign("id_user")
                    ->references("id_user")
                    ->on("users")->onDelete("cascade")->onUpdate("cascade");
            $table->string("camp_name")->collation("utf8mb4_general_ci")->charset("utf8mb4");
            $table->float("budget_total", 4, 2);
            $table->float("budget_daily", 4, 2);
            $table->date("date_from")->useCurrent();
            $table->date("date_to")->useCurrent();
            $table->boolean("updated")->default(false);
            $table->timestamp("last_updated_at")->nullable();
            $table->timestamps();
            
        });

        Schema::create('campaign_images', function (Blueprint $table) {

            $table->id("id_image");
            $table->unsignedBigInteger('id_campaign');
            $table->foreign("id_campaign")->references("id_campaign")
                    ->on("campaigns")->onDelete("cascade")->onUpdate("cascade");
            $table->string("image_name")->collation("utf8mb4_general_ci")->charset("utf8mb4");
            $table->string("image_path");
            $table->integer("image_size")->default(0);
            $table->timestamps();
            $table->boolean("updated")->default(false);
            $table->timestamp("last_updated_at")->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropForeign('id_user'); //
            $table->dropIndex('id_user');
        });
        
        Schema::table('campaign_images', function (Blueprint $table) {
            $table->dropForeign('id_campaign'); //
            $table->dropIndex('id_campaign');
        });
        
        
        Schema::drop("campaign_images");
        Schema::drop("campaigns");
        Schema::drop("users");
        //
    }
};
