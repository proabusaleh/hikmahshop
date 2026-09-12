<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(
        private SearchService $searchService
    ) {}

    public function search(Request $request)
    {
        $params = $request->only([
            'q', 'category', 'brands', 'min_price', 'max_price',
            'min_rating', 'in_stock', 'on_sale', 'color', 'size',
            'featured', 'trending', 'new_arrival', 'best_seller',
            'flash_sale', 'sort', 'per_page', 'page',
        ]);

        $results = $this->searchService->search($params);

        return response()->json([
            'success' => true,
            'data'    => $results['results'],
            'meta'    => [
                'total'             => $results['total'],
                'filters_applied'   => $results['filters_applied'],
                'available_filters' => $results['available_filters'],
            ],
        ]);
    }

    public function suggestions(Request $request)
    {
        $query = $request->input('q', '');
        $limit = min((int) $request->input('limit', 8), 15);

        $suggestions = $this->searchService->suggestions($query, $limit);

        return response()->json([
            'success' => true,
            'data'    => $suggestions,
        ]);
    }

    public function popular()
    {
        return response()->json([
            'success' => true,
            'data'    => $this->searchService->popularSearches(),
        ]);
    }

    public function recent(Request $request)
    {
        $userId = $request->user()?->id;

        return response()->json([
            'success' => true,
            'data'    => $this->searchService->recentSearches($userId),
        ]);
    }

    public function clearRecent(Request $request)
    {
        $this->searchService->clearRecentSearches($request->user()?->id);

        return response()->json([
            'success' => true,
            'message' => 'Recent searches cleared',
        ]);
    }
}
