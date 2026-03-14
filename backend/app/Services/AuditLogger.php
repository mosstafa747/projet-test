<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditLogger
{
    public static function log(string $action, $entity, ?array $payload = null)
    {
        try {
            return AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'entity_type' => is_object($entity) ? get_class($entity) : 'N/A',
                'entity_id' => is_object($entity) ? ($entity->id ?? 0) : 0,
                'payload' => $payload,
                'ip_address' => request()->ip(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('AuditLogger Error: ' . $e->getMessage());
            return null;
        }
    }
}
