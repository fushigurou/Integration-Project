<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UtilisateurController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Utilisateur::all());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:50'],
            'prenom' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:100', 'unique:utilisateur,email'],
            'num' => ['required', 'string', 'max:15'],
            'cin' => ['required', 'string', 'size:8', 'unique:utilisateur,cin'],
            'adresse' => ['nullable', 'string', 'max:255'],
        ]);

        $utilisateur = Utilisateur::create($data);

        return response()->json($utilisateur, 201);
    }

    public function show(Utilisateur $utilisateur): JsonResponse
    {
        return response()->json($utilisateur);
    }

    public function update(Request $request, Utilisateur $utilisateur): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['sometimes', 'string', 'max:50'],
            'prenom' => ['sometimes', 'string', 'max:50'],
            'email' => [
                'sometimes',
                'email',
                'max:100',
                Rule::unique('utilisateur', 'email')->ignore($utilisateur->id_user, 'id_user'),
            ],
            'num' => ['sometimes', 'string', 'max:15'],
            'cin' => [
                'sometimes',
                'string',
                'size:8',
                Rule::unique('utilisateur', 'cin')->ignore($utilisateur->id_user, 'id_user'),
            ],
            'adresse' => ['nullable', 'string', 'max:255'],
        ]);

        $utilisateur->update($data);

        return response()->json($utilisateur);
    }

    public function destroy(Utilisateur $utilisateur): JsonResponse
    {
        $utilisateur->delete();

        return response()->json(null, 204);
    }
}
