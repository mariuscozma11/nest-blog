import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
} from '../dto/auth-response.dto';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
  login(loginDto: LoginDto): Promise<LoginResponseDto>;
}

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');
