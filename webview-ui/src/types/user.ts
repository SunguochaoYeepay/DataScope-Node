export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  avatar: string | null;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  user: User;
}

export interface UserProfileResponse {
  user: User;
}