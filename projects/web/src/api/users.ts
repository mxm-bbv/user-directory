import { apiClient } from '@/api/axios';
import type { ApiResponse } from "@/types/api/Response";
import type { User } from "@/types/User";
import type { AddUser } from "@/types/api/actions/AddUser";
import type { UpdateUser } from "@/types/api/actions/UpdateUser";
import type { BlockUser } from "@/types/api/actions/BlockUser";

class UsersService {
    async getUsers(): Promise<User[]> {
        const response = await apiClient.get<ApiResponse<{ users: User[] }>>('/users');
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to fetch users.');
        }
        return response.data.data.users;
    }

    async addUser(user: AddUser): Promise<User> {
        const response = await apiClient.post<ApiResponse<User>>('/users', user);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to add user.');
        }
        return response.data.data;
    }

    async updateUser(id: number, user: UpdateUser): Promise<User> {
        const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, user);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to update user.');
        }
        return response.data.data;
    }

    async blockUser(user: BlockUser): Promise<string> {
        const response = await apiClient.post<ApiResponse<null>>(`/users/${user.id}/block`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to block user.');
        }
        return response.data.message || 'User blocked successfully.';
    }

    async unblockUser(user: BlockUser): Promise<string> {
        const response = await apiClient.post<ApiResponse<null>>(`/users/${user.id}/unblock`);
        if (!response.data.status) {
            throw new Error(response.data.message || 'Failed to unblock user.');
        }
        return response.data.message || 'User unblocked successfully.';
    }
}

export default new UsersService();
