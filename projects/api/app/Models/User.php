<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @property integer $id
 * @property string $name
 * @property string $login
 * @property string $password
 * @property string $role
 * @property boolean $blocked
 *
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class User extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'login',
        'password',
        'role',
        'blocked',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'blocked' => 'boolean',
        'password' => 'hashed',
    ];
}
