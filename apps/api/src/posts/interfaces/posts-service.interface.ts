import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { User } from '../../users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface IPostsService {
  create(createPostDto: CreatePostDto, author: User): Promise<Post>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Post>>;
  findAllForAdmin(options: PaginationOptions): Promise<PaginatedResult<Post>>;
  findMyPosts(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Post>>;
  findOne(id: string, user?: User | null): Promise<Post>;
  findBySlug(slug: string, user?: User | null): Promise<Post>;
  update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post>;
  publish(id: string, user: User): Promise<Post>;
  archive(id: string, user: User): Promise<Post>;
  remove(id: string): Promise<void>;
}

export const POSTS_SERVICE = Symbol('POSTS_SERVICE');
