export interface User {
    id: number;
    name: string;
    login: string;
    password: string;
    role: 'admin' | 'user';
    blocked: boolean;
}

export interface ApiResponse<T> {
    status: boolean;
    data: T;
    message: string;
    errors: string[] | null;
}
