<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewVote;
use App\Models\ReviewReport;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request, int $productId)
    {
        $query = Review::approved()
            ->forProduct($productId)
            ->with(['user:id,name,avatar'])
            ->orderBy('is_featured', 'desc')
            ->orderBy('helpful_count', 'desc')
            ->orderBy('created_at', 'desc');

        if ($rating = $request->input('rating')) {
            $query->where('rating', $rating);
        }

        if ($request->boolean('verified')) {
            $query->where('is_verified_purchase', true);
        }

        if ($request->boolean('with_images')) {
            $query->whereNotNull('images');
        }

        $sort = $request->input('sort', 'helpful');
        match ($sort) {
            'newest'  => $query->reorder()->orderBy('created_at', 'desc'),
            'oldest'  => $query->reorder()->orderBy('created_at', 'asc'),
            'highest' => $query->reorder()->orderBy('rating', 'desc'),
            'lowest'  => $query->reorder()->orderBy('rating', 'asc'),
            default   => null,
        };

        $reviews = $query->paginate(10);

        $distribution = Review::approved()
            ->forProduct($productId)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating');

        return response()->json([
            'success' => true,
            'data'    => $reviews,
            'meta'    => [
                'distribution' => [
                    5 => $distribution[5] ?? 0,
                    4 => $distribution[4] ?? 0,
                    3 => $distribution[3] ?? 0,
                    2 => $distribution[2] ?? 0,
                    1 => $distribution[1] ?? 0,
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id'   => 'nullable|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'title'      => 'nullable|string|max:255',
            'body'       => 'required|string|min:10|max:2000',
            'images'     => 'nullable|array|max:5',
            'images.*'   => 'image|max:2048',
        ]);

        $user = $request->user();

        $existing = Review::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product',
            ], 422);
        }

        $isVerified = false;
        if ($validated['order_id'] ?? null) {
            $isVerified = Order::where('id', $validated['order_id'])
                ->where('user_id', $user->id)
                ->where('status', 'delivered')
                ->whereHas('items', fn($q) => $q->where('product_id', $validated['product_id']))
                ->exists();
        }

        if (!$isVerified) {
            $isVerified = Order::where('user_id', $user->id)
                ->where('status', 'delivered')
                ->whereHas('items', fn($q) => $q->where('product_id', $validated['product_id']))
                ->exists();
        }

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store("reviews/{$validated['product_id']}", 'public');
            }
        }

        $review = Review::create([
            'user_id'              => $user->id,
            'product_id'           => $validated['product_id'],
            'order_id'             => $validated['order_id'] ?? null,
            'rating'               => $validated['rating'],
            'title'                => $validated['title'] ?? null,
            'body'                 => $validated['body'],
            'images'               => !empty($imagePaths) ? $imagePaths : null,
            'is_verified_purchase' => $isVerified,
            'status'               => 'approved',
        ]);

        Review::recalculateProductRating($validated['product_id']);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully',
            'data'    => $review->load('user:id,name,avatar'),
        ], 201);
    }

    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            abort(403, 'You can only edit your own reviews');
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'title'  => 'nullable|string|max:255',
            'body'   => 'sometimes|string|min:10|max:2000',
        ]);

        $review->update($validated);
        Review::recalculateProductRating($review->product_id);

        return response()->json(['success' => true, 'data' => $review]);
    }

    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            abort(403);
        }

        $productId = $review->product_id;
        $review->delete();
        Review::recalculateProductRating($productId);

        return response()->json(['success' => true, 'message' => 'Review deleted']);
    }

    public function vote(Request $request, Review $review)
    {
        $validated = $request->validate([
            'type' => 'in:helpful,not_helpful',
        ]);

        $userId = $request->user()->id;

        if ($review->user_id === $userId) {
            return response()->json(['success' => false, 'message' => 'Cannot vote on own review'], 422);
        }

        $existing = ReviewVote::where('review_id', $review->id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            if ($existing->type === $validated['type']) {
                $existing->delete();
            } else {
                $existing->update(['type' => $validated['type']]);
            }
        } else {
            ReviewVote::create([
                'review_id' => $review->id,
                'user_id'   => $userId,
                'type'      => $validated['type'],
            ]);
        }

        $review->update([
            'helpful_count' => $review->votes()->where('type', 'helpful')->count(),
        ]);

        return response()->json([
            'success' => true,
            'data'    => ['helpful_count' => $review->helpful_count],
        ]);
    }

    public function report(Request $request, Review $review)
    {
        $validated = $request->validate([
            'reason'  => 'required|in:spam,inappropriate,fake,offensive,other',
            'details' => 'nullable|string|max:500',
        ]);

        $userId = $request->user()->id;

        $exists = ReviewReport::where('review_id', $review->id)
            ->where('user_id', $userId)
            ->exists();

        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Already reported'], 422);
        }

        ReviewReport::create(array_merge($validated, [
            'review_id' => $review->id,
            'user_id'   => $userId,
        ]));

        $review->increment('report_count');

        if ($review->report_count >= 5) {
            $review->update(['status' => 'hidden']);
        }

        return response()->json(['success' => true, 'message' => 'Review reported']);
    }

    public function adminIndex(Request $request)
    {
        $query = Review::with(['user:id,name,email', 'product:id,name,sku']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }
        if ($request->boolean('reported')) {
            $query->where('report_count', '>', 0);
        }

        $reviews = $query->latest()->paginate(20);

        return response()->json(['success' => true, 'data' => $reviews]);
    }

    public function moderate(Request $request, Review $review)
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject,hide,feature,unfeature',
            'note'   => 'nullable|string|max:500',
        ]);

        $productId = $review->product_id;

        match ($validated['action']) {
            'approve'   => $review->update(['status' => 'approved']),
            'reject'    => $review->update(['status' => 'rejected']),
            'hide'      => $review->update(['status' => 'hidden']),
            'feature'   => $review->update(['is_featured' => true]),
            'unfeature' => $review->update(['is_featured' => false]),
        };

        $review->update([
            'moderated_by' => $request->user()->id,
            'admin_note'   => $validated['note'] ?? $review->admin_note,
        ]);

        Review::recalculateProductRating($productId);

        return response()->json([
            'success' => true,
            'message' => "Review {$validated['action']}d",
        ]);
    }

    public function reply(Request $request, Review $review)
    {
        $validated = $request->validate([
            'reply' => 'required|string|max:1000',
        ]);

        $review->update([
            'seller_reply' => $validated['reply'],
            'replied_at'   => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Reply added']);
    }

    public function reported(Request $request)
    {
        $reviews = Review::where('report_count', '>', 0)
            ->with(['user:id,name', 'product:id,name', 'reports.user:id,name'])
            ->orderBy('report_count', 'desc')
            ->paginate(20);

        return response()->json(['success' => true, 'data' => $reviews]);
    }
}
