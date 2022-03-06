<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $totalBudget = $this->faker->numerify("##.##");
        return [
            'id_user'        => \App\Models\User::orderByRaw('RAND()')->first()->id_user,
            'camp_name'      => $this->faker->name(),
            'budget_total'   => $totalBudget,
            'budget_daily'   => $totalBudget / $this->faker->randomDigitNotZero(),
            'date_from'      => $this->faker->dateTimeThisYear("now"),
            'date_to'        => $this->faker->dateTimeBetween("now", "+ 5 days"),
            "updated"        => false
        ];
    }
}
