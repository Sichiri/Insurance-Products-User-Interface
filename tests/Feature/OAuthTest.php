<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use Laravel\Passport\ClientRepository;

class OAuthTest extends TestCase
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
     * Test OAuth token endpoint with valid credentials
     */
    public function test_oauth_token_with_valid_credentials(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'user1',
            'password' => Hash::make('pass1'),
        ]);

        $response = $this->postJson('/api/oauth/token', [
            'grant_type' => 'password',
            'client_id' => 'test_client',
            'client_secret' => 'test_secret',
            'username' => 'user1',
            'password' => 'pass1',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'expires_in',
                'user' => [
                    'id',
                    'name',
                    'email'
                ]
            ]);
    }

    /**
     * Test OAuth token endpoint with invalid client credentials
     */
    public function test_oauth_token_with_invalid_client(): void
    {
        $response = $this->postJson('/api/oauth/token', [
            'grant_type' => 'password',
            'client_id' => 'wrong_client',
            'client_secret' => 'wrong_secret',
            'username' => 'user1',
            'password' => 'pass1',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'invalid_client',
            ]);
    }

    /**
     * Test OAuth token endpoint with invalid user credentials
     */
    public function test_oauth_token_with_invalid_user_credentials(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'user1',
            'password' => Hash::make('pass1'),
        ]);

        $response = $this->postJson('/api/oauth/token', [
            'grant_type' => 'password',
            'client_id' => 'test_client',
            'client_secret' => 'test_secret',
            'username' => 'user1',
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'invalid_grant',
            ]);
    }

    /**
     * Test OAuth token endpoint with unsupported grant type
     */
    public function test_oauth_token_with_unsupported_grant_type(): void
    {
        $response = $this->postJson('/api/oauth/token', [
            'grant_type' => 'client_credentials',
            'client_id' => 'test_client',
            'client_secret' => 'test_secret',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'error' => 'unsupported_grant_type',
            ]);
    }

    /**
     * Test OAuth token endpoint validation
     */
    public function test_oauth_token_validation(): void
    {
        $response = $this->postJson('/api/oauth/token', []);

        $response->assertStatus(422);
    }

    /**
     * Test user endpoint with valid token
     */
    public function test_user_endpoint_with_valid_token(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'user1',
            'password' => Hash::make('pass1'),
        ]);

        // Get token
        $tokenResponse = $this->postJson('/api/oauth/token', [
            'grant_type' => 'password',
            'client_id' => 'test_client',
            'client_secret' => 'test_secret',
            'username' => 'user1',
            'password' => 'pass1',
        ]);

        $token = $tokenResponse->json('access_token');

        // Use token to access protected endpoint
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Test User',
                'email' => 'user1',
            ]);
    }
}
