export interface ApiError { statusCode: number; error: unknown; path: string; timestamp: string }
export interface AuthUser { id: string; name: string; email: string }
export interface AuthTokens { token: string; accessToken: string; refreshToken: string; user: AuthUser }
export * from './nutrition';
