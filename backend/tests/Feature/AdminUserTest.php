<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_toggle_user_admin_status()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/admin/users/{$user->id}/toggle-admin");

        $response->assertStatus(200);
        $this->assertTrue($user->fresh()->is_admin);
    }

    public function test_non_admin_cannot_toggle_user_admin_status()
    {
        $nonAdmin = User::factory()->create(['is_admin' => false]);
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($nonAdmin, 'sanctum')
            ->putJson("/api/admin/users/{$user->id}/toggle-admin");

        $response->assertStatus(403);
    }
}
