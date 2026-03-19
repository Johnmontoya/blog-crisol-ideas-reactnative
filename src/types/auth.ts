export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface IForgot {
  email: string;
}

export interface IResetPassword {
  userId: string;
  password: string;
  token: string;
}

export interface AuthUser {
  id: string | number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

export interface IAuthResponse {
  valid: string;
  userId: string;
  token: string;
}

export interface IResponse {
  message: string;
  valid: string;
  content: string;
}

export interface ApiError {
  message: string;
  detail?: string;
  error?: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  accountVerified: boolean;
  createdAt: string;
}

export interface IUsersResponse {
  valid: string;
  results: string;
  users: IUser[];
}

export interface IUserResponse {
  valid: string;
  user: IUser
}

export interface IVerified {
  userId: string;
  verified: boolean;
}

export interface IVerify {
  userId: String;
  otp: String;
}
