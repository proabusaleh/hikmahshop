<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'product_id', 'order_id', 'order_item_id',
        'rating', 'title', 'body', 'images',
        'is_verified_purchase', 'status', 'is_featured',
        'admin_note', 'moderated_by',
        'helpful_count', 'report_count',
        'seller_reply', 'replied_at',
    ];

    protected $casts = [
        'images'               => 'array',
        'is_verified_purchase' => 'boolean',
        'is_featured'          => 'boolean',
        'replied_at'           => 'datetime',
        'rating'               => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function votes()
    {
        return $this->hasMany(ReviewVote::class);
    }

    public function reports()
    {
        return $this->hasMany(ReviewReport::class);
    }

    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeForProduct($query, int $productId)
    {
        return $query->where('product_id', $productId);
    }

    public static function recalculateProductRating(int $productId): void
    {
        $stats = self::approved()
            ->where('product_id', $productId)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        Product::where('id', $productId)->update([
            'avg_rating'   => round($stats->avg_rating ?? 0, 2),
            'review_count' => $stats->review_count ?? 0,
        ]);
    }
}
