<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PushToken;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->when($request->boolean('unread_only'), fn ($q) => $q->whereNull('read_at'))
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $notifications,
            'meta'    => [
                'unread_count' => $request->user()->unreadNotifications()->count(),
            ],
        ]);
    }

    public function markRead(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['success' => true, 'message' => 'All notifications marked as read']);
    }

    public function registerPushToken(Request $request)
    {
        $validated = $request->validate([
            'platform'    => 'required|in:ios,android,web',
            'token'       => 'required|string|max:500',
            'device_name' => 'nullable|string|max:100',
        ]);

        PushToken::updateOrCreate(
            ['user_id' => $request->user()->id, 'token' => $validated['token']],
            [
                'platform'    => $validated['platform'],
                'device_name' => $validated['device_name'] ?? null,
                'is_active'   => true,
            ]
        );

        return response()->json(['success' => true, 'message' => 'Push token registered']);
    }

    public function removePushToken(Request $request)
    {
        $validated = $request->validate(['token' => 'required|string']);

        PushToken::where('user_id', $request->user()->id)
            ->where('token', $validated['token'])
            ->update(['is_active' => false]);

        return response()->json(['success' => true]);
    }
}
