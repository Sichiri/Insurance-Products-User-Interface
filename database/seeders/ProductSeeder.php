<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'product_id' => 'prod_001',
                'name' => 'Premium Health Plan',
                'type' => 'HEALTH',
                'coverage' => 'Full medical + dental',
                'price' => 200.00,
                'description' => 'Comprehensive health insurance covering medical, dental, and vision care with low deductibles.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_002',
                'name' => 'Basic Health Plan',
                'type' => 'HEALTH',
                'coverage' => 'Essential medical coverage',
                'price' => 100.00,
                'description' => 'Affordable health insurance for essential medical needs.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_003',
                'name' => 'Family Life Insurance',
                'type' => 'LIFE',
                'coverage' => 'Life coverage up to $500,000',
                'price' => 150.00,
                'description' => 'Protect your family financial future with comprehensive life insurance.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_004',
                'name' => 'Term Life Insurance',
                'type' => 'LIFE',
                'coverage' => 'Life coverage up to $250,000 for 20 years',
                'price' => 75.00,
                'description' => 'Affordable term life insurance with fixed premiums.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_005',
                'name' => 'Auto Insurance Premium',
                'type' => 'AUTO',
                'coverage' => 'Full coverage including collision and comprehensive',
                'price' => 180.00,
                'description' => 'Complete auto insurance protection for your vehicle.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_006',
                'name' => 'Auto Insurance Basic',
                'type' => 'AUTO',
                'coverage' => 'Liability only coverage',
                'price' => 80.00,
                'description' => 'Basic auto liability insurance meeting state requirements.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_007',
                'name' => 'Homeowners Insurance',
                'type' => 'HOME',
                'coverage' => 'Dwelling, personal property, and liability',
                'price' => 220.00,
                'description' => 'Protect your home and belongings with comprehensive homeowners insurance.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_008',
                'name' => 'Renters Insurance',
                'type' => 'HOME',
                'coverage' => 'Personal property and liability for renters',
                'price' => 45.00,
                'description' => 'Affordable protection for your belongings when renting.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_009',
                'name' => 'Travel Insurance',
                'type' => 'TRAVEL',
                'coverage' => 'Trip cancellation, medical, and baggage',
                'price' => 35.00,
                'description' => 'Comprehensive travel protection for your trips.',
                'is_active' => true,
            ],
            [
                'product_id' => 'prod_010',
                'name' => 'Pet Insurance',
                'type' => 'PET',
                'coverage' => 'Accidents, illnesses, and wellness',
                'price' => 55.00,
                'description' => 'Keep your furry friends protected with pet insurance.',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
