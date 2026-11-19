<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = Utilisateur::query()
            ->where('email', strtolower(trim($credentials['email'])))
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Identifiants incorrects. Vérifiez votre email et votre mot de passe.',
            ], 401);
        }

        $payload = $user->toAuthPayload();
        if ($payload === null) {
            return response()->json([
                'message' => 'Ce compte n’a pas de rôle autorisé (DG ou DR).',
            ], 403);
        }

        $token = Auth::guard('api')->login($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => $payload,
        ]);
    }

    public function me(): JsonResponse
    {
        /** @var Utilisateur $user */
        $user = Auth::guard('api')->user();
        $payload = $user->toAuthPayload();

        if ($payload === null) {
            return response()->json(['message' => 'Session invalide.'], 401);
        }

        return response()->json(['user' => $payload]);
    }

    public function refresh(): JsonResponse
    {
        $token = Auth::guard('api')->refresh();
        /** @var Utilisateur $user */
        $user = Auth::guard('api')->user();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => $user->toAuthPayload(),
        ]);
    }

    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }
}
