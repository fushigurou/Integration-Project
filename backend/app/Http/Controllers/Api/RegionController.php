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
        return response()->json(Region::orderBy('nom')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:50', 'unique:region,nom'],
            'adresse' => ['required', 'string', 'max:255'],
        ]);

        return response()->json(Region::create($data), 201);
    }

    public function show(Region $region): JsonResponse
    {
        return response()->json($region);
    }

    public function update(Request $request, Region $region): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:50', Rule::unique('region', 'nom')->ignore($region->id_r, 'id_r')],
            'adresse' => ['required', 'string', 'max:255'],
        ]);

        $region->update($data);

        return response()->json($region);
    }

    public function destroy(Region $region): JsonResponse
    {
        $region->delete();

        return response()->json(null, 204);
    }
}
