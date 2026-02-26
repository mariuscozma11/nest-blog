import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from '../common/enums/post-status.enum';
import { Role } from '../common/enums/role.enum';

describe('PostsService', () => {
  let service: PostsService;
  let repository: jest.Mocked<Repository<Post>>;

  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: Role.USER,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockAdmin: User = {
    ...mockUser,
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@example.com',
    role: Role.ADMIN,
  };

  const mockPost: Post = {
    id: '660e8400-e29b-41d4-a716-446655440000',
    title: 'Test Post',
    content: 'Test content for the post',
    slug: 'test-post-abc123',
    excerpt: 'Test excerpt',
    status: PostStatus.DRAFT,
    publishedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    author: mockUser,
    authorId: mockUser.id,
    generateSlug: jest.fn(),
    updateSlug: jest.fn(),
  };

  const mockPublishedPost: Post = {
    ...mockPost,
    id: '660e8400-e29b-41d4-a716-446655440001',
    status: PostStatus.PUBLISHED,
    publishedAt: new Date('2024-01-02'),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a post as draft', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content for the post',
      };

      repository.create.mockReturnValue(mockPost);
      repository.save.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto, mockUser);

      expect(repository.create).toHaveBeenCalledWith({
        ...createPostDto,
        authorId: mockUser.id,
        status: PostStatus.DRAFT,
      });
      expect(repository.save).toHaveBeenCalledWith(mockPost);
      expect(result.author).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated published posts', async () => {
      const posts = [mockPublishedPost];
      repository.findAndCount.mockResolvedValue([posts, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { status: PostStatus.PUBLISHED },
        order: { publishedAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual(posts);
      expect(result.total).toBe(1);
    });

    it('should calculate correct skip for page 2', async () => {
      repository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ page: 2, limit: 10 });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { status: PostStatus.PUBLISHED },
        order: { publishedAt: 'DESC' },
        skip: 10,
        take: 10,
      });
    });

    it('should calculate correct skip for page 3 with limit 5', async () => {
      repository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ page: 3, limit: 5 });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { status: PostStatus.PUBLISHED },
        order: { publishedAt: 'DESC' },
        skip: 10,
        take: 5,
      });
    });
  });

  describe('findAllForAdmin', () => {
    it('should return paginated posts for admin', async () => {
      const allPosts = [mockPost, mockPublishedPost];
      repository.findAndCount.mockResolvedValue([allPosts, 2]);

      const result = await service.findAllForAdmin({ page: 1, limit: 10 });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual(allPosts);
      expect(result.total).toBe(2);
    });
  });

  describe('findMyPosts', () => {
    it('should return paginated posts for a specific user', async () => {
      repository.findAndCount.mockResolvedValue([[mockPost], 1]);

      const result = await service.findMyPosts(mockUser.id, {
        page: 1,
        limit: 10,
      });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { authorId: mockUser.id },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual([mockPost]);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return published post for unauthenticated user', async () => {
      repository.findOne.mockResolvedValue(mockPublishedPost);

      const result = await service.findOne(mockPublishedPost.id, null);

      expect(result).toEqual(mockPublishedPost);
    });

    it('should throw NotFoundException for draft when unauthenticated', async () => {
      repository.findOne.mockResolvedValue(mockPost);

      await expect(service.findOne(mockPost.id, null)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return draft for author', async () => {
      repository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne(mockPost.id, mockUser);

      expect(result).toEqual(mockPost);
    });

    it('should return any post for admin', async () => {
      repository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne(mockPost.id, mockAdmin);

      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id', null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Title',
    };

    it('should update post for owner', async () => {
      const updatedPost = { ...mockPost, title: 'Updated Title' };
      repository.findOne.mockResolvedValue(mockPost);
      repository.save.mockResolvedValue(updatedPost);

      const result = await service.update(mockPost.id, updatePostDto, mockUser);

      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
    });

    it('should update post for admin', async () => {
      const updatedPost = { ...mockPost, title: 'Updated Title' };
      repository.findOne.mockResolvedValue(mockPost);
      repository.save.mockResolvedValue(updatedPost);

      const result = await service.update(
        mockPost.id,
        updatePostDto,
        mockAdmin,
      );

      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
    });

    it('should throw ForbiddenException for non-owner', async () => {
      const otherUser: User = { ...mockUser, id: 'other-user-id' };
      repository.findOne.mockResolvedValue(mockPost);

      await expect(
        service.update(mockPost.id, updatePostDto, otherUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('publish', () => {
    it('should publish post and set publishedAt', async () => {
      const publishedPost = {
        ...mockPost,
        status: PostStatus.PUBLISHED,
        publishedAt: expect.any(Date),
      };
      repository.findOne.mockResolvedValue(mockPost);
      repository.save.mockResolvedValue(publishedPost);

      const result = await service.publish(mockPost.id, mockUser);

      expect(result.status).toBe(PostStatus.PUBLISHED);
      expect(result.publishedAt).toBeDefined();
    });
  });

  describe('archive', () => {
    it('should archive post', async () => {
      const archivedPost = { ...mockPost, status: PostStatus.ARCHIVED };
      repository.findOne.mockResolvedValue(mockPost);
      repository.save.mockResolvedValue(archivedPost);

      const result = await service.archive(mockPost.id, mockUser);

      expect(result.status).toBe(PostStatus.ARCHIVED);
    });
  });

  describe('remove', () => {
    it('should remove post', async () => {
      repository.findOne.mockResolvedValue(mockPost);
      repository.remove.mockResolvedValue(mockPost);

      await service.remove(mockPost.id);

      expect(repository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
