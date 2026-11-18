<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirecteurRegional;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DirecteurRegionalController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            DirecteurRegional::with(['utilisateur', 'region'])->get()
        );
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
            'role' => ['nullable', 'string', 'max:30'],
        ]);

        $dr = DB::transaction(function () use ($data) {
            $user = Utilisateur::create([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'num' => $data['num'],
                'cin' => $data['cin'],
                'adresse' => $data['adresse'] ?? null,
            ]);

            return DirecteurRegional::create([
                'id_dr' => $user->id_user,
                'role' => $data['role'] ?? 'DR',
            ]);
        });

        return response()->json($dr->load(['utilisateur', 'region']), 201);
    }

    public function show(DirecteurRegional $directeurRegional): JsonResponse
    {
        return response()->json($directeurRegional->load(['utilisateur', 'region']));
    }

    public function update(Request $request, DirecteurRegional $directeurRegional): JsonResponse
    {
        $user = $directeurRegional->utilisateur;

        $data = $request->validate([
            'nom' => ['sometimes', 'string', 'max:50'],
            'prenom' => ['sometimes', 'string', 'max:50'],
            'email' => [
                'sometimes',
                'email',
                'max:100',
                Rule::unique('utilisateur', 'email')->ignore($user->id_user, 'id_user'),
            ],
            'num' => ['sometimes', 'string', 'max:15'],
            'cin' => [
                'sometimes',
                'string',
                'size:8',
                Rule::unique('utilisateur', 'cin')->ignore($user->id_user, 'id_user'),
            ],
            'adresse' => ['nullable', 'string', 'max:255'],
            'role' => ['sometimes', 'string', 'max:30'],
        ]);

        DB::transaction(function () use ($data, $user, $directeurRegional) {
            $user->update(collect($data)->only([
                'nom', 'prenom', 'email', 'num', 'cin', 'adresse',
            ])->all());

            if (array_key_exists('role', $data)) {
                $directeurRegional->update(['role' => $data['role']]);
            }
        });

        return response()->json($directeurRegional->fresh()->load(['utilisateur', 'region']));
    }

    public function destroy(DirecteurRegional $directeurRegional): JsonResponse
    {
        $directeurRegional->utilisateur()->delete();

        return response()->json(null, 204);
    }
}
