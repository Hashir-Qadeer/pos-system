export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface AuthResponseDto {
    userId: number;
    token: string;
    name: string;
    role: string;
}