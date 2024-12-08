<?php

namespace App\Http\Controllers\Api\Actions;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\StoreUsersRequest;
use App\Http\Requests\UpdateUsersRequest;
use App\Http\Resources\UsersCollection;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class UsersController extends ApiController
{
    /**
     * Список пользователей
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $users = User::all();
        return $this->success(new UsersCollection($users));
    }

    /**
     * Добавить пользователя
     *
     * @param StoreUsersRequest $request
     * @return JsonResponse
     */
    public function store(StoreUsersRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        return $this->success($user, 201, 'User created successfully');
    }

    /**
     * Редактировать пользователя
     *
     * @param UpdateUsersRequest $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(UpdateUsersRequest $request, User $user): JsonResponse
    {
        if (!$user->exists) {
            throw new ModelNotFoundException();
        }

        $user->update($request->validated());

        return $this->success(data: $user, message: 'User updated successfully');
    }

    /**
     * Заблокировать пользователя
     *
     * @param User $user
     * @return JsonResponse
     */
    public function block(User $user): JsonResponse
    {
        if (!$user->exists) {
            throw new ModelNotFoundException();
        }

        $user->update(['blocked' => true]);

        return $this->success(null, 200, 'User blocked successfully');
    }

    /**
     * Разблокировать пользователя
     *
     * @param User $user
     * @return JsonResponse
     */
    public function unblock(User $user): JsonResponse
    {
        if (!$user->exists) {
            throw new ModelNotFoundException();
        }

        $user->update(['blocked' => false]);

        return $this->success(null, 200, 'User unblocked successfully');
    }
}
