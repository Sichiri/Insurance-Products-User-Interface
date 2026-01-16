<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Artisan;
use Laravel\Passport\Passport;
use Laravel\Passport\ClientRepository;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create encryption keys if they don't exist
        if (!file_exists(storage_path('oauth-private.key'))) {
            Artisan::call('passport:keys', ['--force' => true]);
        }
        
        // Create Personal Access Client for testing
        $clientRepository = app(ClientRepository::class);
        $clientRepository->createPersonalAccessGrantClient(
            'Personal Access Client',
            'users'
        );
    }

    /**
     * Test products endpoint returns unauthorized without token
     */
    public function test_products_endpoint_requires_authentication(): void
    {
        $response = $this->getJson('/api/products');
        
        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can access products
     */
    public function test_authenticated_user_can_get_products(): void
    {
        $user = User::factory()->create();
        
        // Create sample products
        Product::create([
            'product_id' => 'prod_001',
            'name' => 'Premium Health Plan',
            'type' => 'HEALTH',
            'coverage' => 'Full medical + dental',
            'price' => 200.00,
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/products');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'product_id',
                        'name',
                        'type',
                        'coverage',
                        'price',
                    ]
                ],
                'message'
            ]);
    }

    /**
     * Test products response contains correct data
     */
    public function test_products_response_has_correct_structure(): void
    {
        $user = User::factory()->create();
        
        Product::create([
            'product_id' => 'prod_test',
            'name' => 'Test Insurance',
            'type' => 'AUTO',
            'coverage' => 'Full coverage',
            'price' => 150.00,
            'description' => 'Test description',
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/products');
        
        $response->assertStatus(200);
        
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('prod_test', $data[0]['product_id']);
        $this->assertEquals('Test Insurance', $data[0]['name']);
        $this->assertEquals('AUTO', $data[0]['type']);
    }

    /**
     * Test single product endpoint
     */
    public function test_can_get_single_product(): void
    {
        $user = User::factory()->create();
        
        Product::create([
            'product_id' => 'prod_single',
            'name' => 'Single Product',
            'type' => 'LIFE',
            'coverage' => 'Life coverage',
            'price' => 100.00,
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/products/prod_single');
        
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'product_id' => 'prod_single',
                    'name' => 'Single Product',
                ]
            ]);
    }

    /**
     * Test 404 for non-existent product
     */
    public function test_returns_404_for_non_existent_product(): void
    {
        $user = User::factory()->create();
        
        Passport::actingAs($user);

        $response = $this->getJson('/api/products/non_existent');
        
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Product not found'
            ]);
    }
}
