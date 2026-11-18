<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehiculeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Vehicule::with('region')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'matricule' => ['required', 'string', 'max:20', 'unique:vehicule,matricule'],
            'marque' => ['required', 'string', 'max:50'],
            'etat' => [
                'nullable',
                Rule::in(['AVAILABLE', 'ON_MISSION', 'UNDER_MAINTENANCE', 'UNAVAILABLE']),
            ],
            'id_r' => ['required', 'integer', 'exists:region,id_r'],
        ]);

        $vehicule = Vehicule::create($data);

        return response()->json($vehicule->load('region'), 201);
    }

    public function show(Vehicule $vehicule): JsonResponse
    {
        return response()->json($vehicule->load('region'));
    }

    public function update(Request $request, Vehicule $vehicule): JsonResponse
    {
        $data = $request->validate([
            'matricule' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('vehicule', 'matricule')->ignore($vehicule->id_v, 'id_v'),
            ],
            'marque' => ['sometimes', 'string', 'max:50'],
            'etat' => [
                'sometimes',
                Rule::in(['AVAILABLE', 'ON_MISSION', 'UNDER_MAINTENANCE', 'UNAVAILABLE']),
            ],
            'id_r' => ['sometimes', 'integer', 'exists:region,id_r'],
        ]);

        $vehicule->update($data);

        return response()->json($vehicule->load('region'));
    }

    public function destroy(Vehicule $vehicule): JsonResponse
    {
        $vehicule->delete();

        return response()->json(null, 204);
    }
}
