<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return Notification::where('id_utilisateur', auth()->id())
                         ->orderBy('created_at', 'desc')
                         ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
            'id_lie' => 'nullable|integer',
            'type_lie' => 'nullable|string'
        ]);

        // Only admins can create notifications for other users
        $userId = auth()->user()->hasRole('admin') 
            ? $request->input('id_utilisateur', auth()->id())
            : auth()->id();

        $notification = Notification::create([
            'id_utilisateur' => $userId,
            'titre' => $validated['titre'],
            'message' => $validated['message'],
            'type' => $validated['type'],
            'id_lie' => $validated['id_lie'] ?? null,
            'type_lie' => $validated['type_lie'] ?? null
        ]);

        return response()->json($notification, 201);
    }

    public function show($id)
    {
        $notification = Notification::findOrFail($id);
        
        // Verify the authenticated user owns the notification
        if ($notification->id_utilisateur != auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Mark as read when retrieved
        if (!$notification->lu) {
            $notification->update(['lu' => true]);
        }

        return $notification;
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        
        // Verify the authenticated user owns the notification
        if ($notification->id_utilisateur != auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'lu' => 'boolean'
        ]);

        $notification->update($validated);
        return response()->json($notification);
    }

    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        
        // Verify the authenticated user owns the notification
        if ($notification->id_utilisateur != auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $notification->delete();
        return response()->json(null, 204);
    }

    public function markAllAsRead()
    {
        Notification::where('id_utilisateur', auth()->id())
                  ->where('lu', false)
                  ->update(['lu' => true]);

        return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
    }

    public function unreadCount()
    {
        $count = Notification::where('id_utilisateur', auth()->id())
                           ->where('lu', false)
                           ->count();

        return response()->json(['count' => $count]);
    }
}