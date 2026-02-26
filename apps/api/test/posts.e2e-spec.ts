import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Role } from '../src/common/enums/role.enum';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userToken: string;
  let adminToken: string;
  let testPostId: string;

  const testUser = {
    email: 'e2e-posts-user@example.com',
    password: 'password123',
    name: 'Posts Test User',
  };

  const testAdmin = {
    email: 'e2e-posts-admin@example.com',
    password: 'password123',
    name: 'Posts Test Admin',
  };

  const testPost = {
    title: 'E2E Test Post',
    content: 'This is the content for our e2e test post.',
    excerpt: 'Test excerpt',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Register and login test user
    await request(app.getHttpServer()).post('/auth/register').send(testUser);

    const userLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    userToken = userLoginResponse.body.accessToken as string;

    // Register admin and update role
    await request(app.getHttpServer()).post('/auth/register').send(testAdmin);

    await dataSource.query(
      `UPDATE users SET role = '${Role.ADMIN}' WHERE email = '${testAdmin.email}'`,
    );

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });

    adminToken = adminLoginResponse.body.accessToken as string;
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query(`DELETE FROM posts`);
      await dataSource.query(
        `DELETE FROM users WHERE email IN ('${testUser.email}', '${testAdmin.email}')`,
      );
    }
    await app.close();
  });

  describe('/posts (POST)', () => {
    it('should create a post as draft', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testPost)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(testPost.title);
      expect(response.body.status).toBe('draft');
      expect(response.body.publishedAt).toBeNull();

      testPostId = response.body.id as string;
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .send(testPost)
        .expect(401);
    });

    it('should return 400 for invalid data', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'ab' }) // Too short
        .expect(400);
    });
  });

  describe('/posts (GET)', () => {
    it('should return only published posts for public', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);

      // Draft post should not be visible
      const draftPost = (response.body.data as Array<{ id: string }>).find(
        (p) => p.id === testPostId,
      );
      expect(draftPost).toBeUndefined();
    });
  });

  describe('/posts/my (GET)', () => {
    it('should return user posts including drafts', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts/my')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
      const post = (response.body.data as Array<{ id: string }>).find(
        (p) => p.id === testPostId,
      );
      expect(post).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/posts/my').expect(401);
    });
  });

  describe('/posts/:id (GET)', () => {
    it('should return 404 for draft post without auth', async () => {
      await request(app.getHttpServer())
        .get(`/posts/${testPostId}`)
        .expect(404);
    });

    it('should return draft post for owner', async () => {
      const response = await request(app.getHttpServer())
        .get(`/posts/${testPostId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.id).toBe(testPostId);
    });

    it('should return draft post for admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/posts/${testPostId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(testPostId);
    });
  });

  describe('/posts/:id (PATCH)', () => {
    it('should update post for owner', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/posts/${testPostId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Updated E2E Test Post' })
        .expect(200);

      expect(response.body.title).toBe('Updated E2E Test Post');
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/posts/${testPostId}`)
        .send({ title: 'Unauthorized Update' })
        .expect(401);
    });
  });

  describe('/posts/:id/publish (PATCH)', () => {
    it('should publish post for owner', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/posts/${testPostId}/publish`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.status).toBe('published');
      expect(response.body.publishedAt).toBeDefined();
    });

    it('should return published post for public', async () => {
      const response = await request(app.getHttpServer())
        .get(`/posts/${testPostId}`)
        .expect(200);

      expect(response.body.id).toBe(testPostId);
      expect(response.body.status).toBe('published');
    });
  });

  describe('/posts/:id/archive (PATCH)', () => {
    it('should archive post for owner', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/posts/${testPostId}/archive`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.status).toBe('archived');
    });

    it('should return 404 for archived post without auth', async () => {
      await request(app.getHttpServer())
        .get(`/posts/${testPostId}`)
        .expect(404);
    });
  });

  describe('/posts/admin/all (GET)', () => {
    it('should return all posts for admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return 403 for non-admin user', async () => {
      await request(app.getHttpServer())
        .get('/posts/admin/all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/posts/admin/all').expect(401);
    });
  });

  describe('/posts/:id (DELETE)', () => {
    it('should return 403 for non-admin user', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${testPostId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should delete post for admin', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${testPostId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify post is deleted
      await request(app.getHttpServer())
        .get(`/posts/${testPostId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${testPostId}`)
        .expect(401);
    });
  });
});
