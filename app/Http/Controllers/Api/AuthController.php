<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Laravel\Passport\Token;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Issue OAuth 2.0 access token using Resource Owner Password Credentials Grant
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function issueToken(Request $request)
    {
        $request->validate([
            'grant_type' => 'required|string',
            'client_id' => 'required|string',
            'client_secret' => 'required|string',
            'username' => 'required_if:grant_type,password|string',
            'password' => 'required_if:grant_type,password|string',
        ]);

        // Hardcoded client credentials for testing
        $validClientId = 'test_client';
        $validClientSecret = 'test_secret';

        // Validate client credentials
        if ($request->client_id !== $validClientId || $request->client_secret !== $validClientSecret) {
            return response()->json([
                'error' => 'invalid_client',
                'error_description' => 'Client authentication failed'
            ], 401);
        }

        // Handle password grant type
        if ($request->grant_type === 'password') {
            // Find user by username (email)
            $user = User::where('email', $request->username)->first();

            // Validate user credentials
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'error' => 'invalid_grant',
                    'error_description' => 'The user credentials were incorrect'
                ], 401);
            }

            // Create token using Passport
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->accessToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => config('passport.personal_access_tokens.expire_in', 31536000),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ]);
        }

        return response()->json([
            'error' => 'unsupported_grant_type',
            'error_description' => 'The authorization grant type is not supported'
        ], 400);
    }

    /**
     * Logout user and revoke token
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
