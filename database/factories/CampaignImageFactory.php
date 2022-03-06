<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Campaign;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CampaignImage>
 */
class CampaignImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            "id_campaign" => Campaign::orderByRaw('RAND()')->first()->id_campaign,
            "image_name" => $this->faker->name(),
            "image_path" => "userImage/test.png",
            "updated"    => false
        ];
    }
}
