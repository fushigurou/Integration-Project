<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirecteurGeneral;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DirecteurGeneralController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            DirecteurGeneral::with('utilisateur')->get()
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
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['nullable', 'string', 'max:30'],
        ]);

        $dg = DB::transaction(function () use ($data) {
            $user = Utilisateur::create([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'password' => $data['password'] ?? 'steg1234',
                'num' => $data['num'],
                'cin' => $data['cin'],
                'adresse' => $data['adresse'] ?? null,
            ]);

            return DirecteurGeneral::create([
                'id_dg' => $user->id_user,
                'role' => $data['role'] ?? 'DG',
            ]);
        });

        return response()->json($dg->load('utilisateur'), 201);
    }

    public function show(DirecteurGeneral $directeurGeneral): JsonResponse
    {
        return response()->json($directeurGeneral->load('utilisateur'));
    }

    public function update(Request $request, DirecteurGeneral $directeurGeneral): JsonResponse
    {
        $user = $directeurGeneral->utilisateur;

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

        DB::transaction(function () use ($data, $user, $directeurGeneral) {
            $user->update(collect($data)->only([
                'nom', 'prenom', 'email', 'num', 'cin', 'adresse',
            ])->all());

            if (array_key_exists('role', $data)) {
                $directeurGeneral->update(['role' => $data['role']]);
            }
        });

        return response()->json($directeurGeneral->fresh()->load('utilisateur'));
    }

    public function destroy(DirecteurGeneral $directeurGeneral): JsonResponse
    {
        $directeurGeneral->utilisateur()->delete();

        return response()->json(null, 204);
    }
}
