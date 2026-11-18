<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chauffeur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ChauffeurController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Chauffeur::with('region')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:50'],
            'prenom' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:100', 'unique:chauffeur,email'],
            'num' => ['required', 'string', 'max:15'],
            'cin' => ['required', 'string', 'size:8', 'unique:chauffeur,cin'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'id_r' => ['required', 'integer', 'exists:region,id_r'],
        ]);

        $chauffeur = Chauffeur::create($data);

        return response()->json($chauffeur->load('region'), 201);
    }

    public function show(Chauffeur $chauffeur): JsonResponse
    {
        return response()->json($chauffeur->load('region'));
    }

    public function update(Request $request, Chauffeur $chauffeur): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['sometimes', 'string', 'max:50'],
            'prenom' => ['sometimes', 'string', 'max:50'],
            'email' => [
                'sometimes',
                'email',
                'max:100',
                Rule::unique('chauffeur', 'email')->ignore($chauffeur->id_ch, 'id_ch'),
            ],
            'num' => ['sometimes', 'string', 'max:15'],
            'cin' => [
                'sometimes',
                'string',
                'size:8',
                Rule::unique('chauffeur', 'cin')->ignore($chauffeur->id_ch, 'id_ch'),
            ],
            'adresse' => ['nullable', 'string', 'max:255'],
            'id_r' => ['sometimes', 'integer', 'exists:region,id_r'],
        ]);

        $chauffeur->update($data);

        return response()->json($chauffeur->load('region'));
    }

    public function destroy(Chauffeur $chauffeur): JsonResponse
    {
        $chauffeur->delete();

        return response()->json(null, 204);
    }
}
