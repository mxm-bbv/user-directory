import apiClient from './axios';
import type {ApiResponse, User} from "@/types/User";

class UsersService {
  /**
   * Получить список пользователей.
   * @returns Promise с массивом пользователей.
   */
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to fetch users.');
    }
    return response.data.data;
  }

  /**
   * Добавить нового пользователя.
   * @param user Данные нового пользователя.
   * @returns Созданный пользователь.
   */
  async addUser(user): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/users', user);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to add user.');
    }
    return response.data.data;
  }

  /**
   * Обновить данные пользователя.
   * @param id ID пользователя.
   * @param user Обновленные данные.
   * @returns Обновленный пользователь.
   */
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, user);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to update user.');
    }
    return response.data.data;
  }

  /**
   * Заблокировать пользователя.
   * @param id ID пользователя.
   * @returns Сообщение об успешности операции.
   */
  async blockUser(id: number): Promise<string> {
    const response = await apiClient.post<ApiResponse<null>>(`/users/${id}/block`);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to block user.');
    }
    return response.data.message;
  }

  /**
   * Разблокировать пользователя.
   * @param id ID пользователя.
   * @returns Сообщение об успешности операции.
   */
  async unblockUser(id: number): Promise<string> {
    const response = await apiClient.post<ApiResponse<null>>(`/users/${id}/unblock`);
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to unblock user.');
    }
    return response.data.message;
  }
}

export default new UsersService();
