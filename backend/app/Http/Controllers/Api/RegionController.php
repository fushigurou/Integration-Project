<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RegionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Region::with(['directeurRegional.utilisateur', 'chauffeurs', 'vehicules'])->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:50', 'unique:region,nom'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'id_dr' => ['nullable', 'integer', 'exists:directeur_regional,id_dr', 'unique:region,id_dr'],
        ]);

        $region = Region::create($data);

        return response()->json($region->load('directeurRegional.utilisateur'), 201);
    }

    public function show(Region $region): JsonResponse
    {
        return response()->json(
            $region->load(['directeurRegional.utilisateur', 'chauffeurs', 'vehicules'])
        );
    }

    public function update(Request $request, Region $region): JsonResponse
    {
        $data = $request->validate([
            'nom' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('region', 'nom')->ignore($region->id_r, 'id_r'),
            ],
            'adresse' => ['nullable', 'string', 'max:255'],
            'id_dr' => [
                'nullable',
                'integer',
                'exists:directeur_regional,id_dr',
                Rule::unique('region', 'id_dr')->ignore($region->id_r, 'id_r'),
            ],
        ]);

        $region->update($data);

        return response()->json($region->load('directeurRegional.utilisateur'));
    }

    public function destroy(Region $region): JsonResponse
    {
        $region->delete();

        return response()->json(null, 204);
    }
}
