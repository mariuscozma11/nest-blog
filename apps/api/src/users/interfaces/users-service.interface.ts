import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export const USERS_SERVICE = Symbol('USERS_SERVICE');
