# Nest Blog Monorepo

[![CI](https://github.com/YOUR_USERNAME/nest-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/nest-blog/actions/workflows/ci.yml)

A full-stack blog platform with a NestJS API backend and Vite React frontend, organized as a pnpm monorepo.

## Features

### Backend (API)
- JWT Authentication with role-based access (User/Admin)
- Blog posts with draft/published/archived states
- Pagination support
- Swagger API documentation
- Rate limiting & health checks
- PostgreSQL with TypeORM
- Docker & Railway deployment ready

### Frontend (Web)
- Vite + React 19 with TypeScript
- Tailwind CSS v4
- Dark/Light theme support
- Public blog pages
- Admin dashboard for post management
- Responsive design

## Project Structure

```
nest-blog/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── users/       # Users module
│   │   │   ├── posts/       # Posts module
│   │   │   ├── health/      # Health checks
│   │   │   ├── config/      # Configuration
│   │   │   ├── common/      # Shared (filters, interceptors, DTOs)
│   │   │   ├── database/    # Seeds
│   │   │   └── migrations/  # TypeORM migrations
│   │   ├── test/            # E2E tests
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                 # Vite React frontend
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── contexts/    # React contexts (auth, theme)
│       │   ├── pages/       # Page components
│       │   ├── services/    # API services
│       │   └── hooks/       # Custom hooks
│       └── package.json
│
├── .github/workflows/       # CI/CD workflows
├── docker-compose.yml       # Local PostgreSQL & pgAdmin
├── pnpm-workspace.yaml      # Workspace config
└── package.json             # Root package.json
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nest-blog.git
cd nest-blog

# Install dependencies
pnpm install

# Start PostgreSQL database
pnpm db:up

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Run database migrations
pnpm migration:run

# Seed admin user
pnpm seed:admin

# Start both API and Web in development mode
pnpm dev
```

The applications will be available at:
- **API**: http://localhost:3000
- **API Docs (Swagger)**: http://localhost:3000/api
- **Web**: http://localhost:5173

### Running Individual Apps

```bash
# API only
pnpm dev:api

# Web only
pnpm dev:web
```

## Environment Variables

### API (`apps/api/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL URL (Railway) | - |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_DATABASE` | Database name | `nest_blog` |
| `JWT_SECRET` | JWT secret (min 32 chars) | **required** |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `CORS_ORIGIN` | CORS origins | `*` |
| `THROTTLE_TTL` | Rate limit window (ms) | `60000` |
| `THROTTLE_LIMIT` | Max requests per window | `100` |

### Web (`apps/web/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `http://localhost:3000` |

## Database

### Migrations

```bash
# Generate migration from entity changes
pnpm migration:generate apps/api/src/migrations/MigrationName

# Run pending migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert
```

### Seeding

```bash
# Create admin user (uses env vars or defaults)
pnpm seed:admin

# Custom admin credentials
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secure123 pnpm seed:admin
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | No | Register user |
| `POST` | `/auth/login` | No | Login |
| `GET` | `/auth/me` | Yes | Get profile |
| `GET` | `/posts` | No | List published posts |
| `GET` | `/posts/:id` | Optional | Get post by ID |
| `GET` | `/posts/slug/:slug` | Optional | Get post by slug |
| `GET` | `/posts/my` | Yes | List my posts |
| `GET` | `/posts/admin/all` | Admin | List all posts |
| `POST` | `/posts` | Yes | Create draft |
| `PATCH` | `/posts/:id` | Owner/Admin | Update post |
| `PATCH` | `/posts/:id/publish` | Owner/Admin | Publish |
| `PATCH` | `/posts/:id/archive` | Owner/Admin | Archive |
| `DELETE` | `/posts/:id` | Admin | Delete |
| `GET` | `/health` | No | Health check |

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/blog` | Blog listing (public) |
| `/blog/:slug` | Blog post (public) |
| `/contact` | Contact page |
| `/admin` | Admin login |
| `/admin/dashboard` | Post management (admin only) |

## CI/CD Pipeline

### GitHub Actions Workflow

The CI pipeline runs on every push and pull request:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Lint API   │  │  Lint Web   │  │ API Tests   │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Build API  │  │  Build Web  │  │ E2E Tests   │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Jobs:**
- **Lint API/Web**: ESLint code quality checks
- **API Tests**: Unit tests with Jest
- **E2E Tests**: Integration tests with PostgreSQL service
- **Build**: Compile both applications

## Production Deployment

### Option 1: Railway (Recommended)

Railway supports deploying both the API and Web as separate services.

#### Step 1: Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init
```

#### Step 2: Deploy API

1. In Railway Dashboard, create a new service from GitHub
2. Select the repository
3. Set the root directory to `apps/api`
4. Add PostgreSQL plugin
5. Set environment variables:
   - `JWT_SECRET` (required, min 32 chars)
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-web-domain.com`

Railway auto-provides `DATABASE_URL` and `PORT`.

#### Step 3: Deploy Web

1. Create another service from the same repo
2. Set root directory to `apps/web`
3. Set environment variables:
   - `VITE_API_URL=https://your-api-domain.railway.app`

#### Step 4: Seed Admin User

```bash
# Via Railway CLI
railway run --service api pnpm seed:admin
```

### Option 2: Vercel (Web) + Railway (API)

1. Deploy API to Railway (steps above)
2. Deploy Web to Vercel:
   - Connect GitHub repo
   - Set root directory: `apps/web`
   - Set `VITE_API_URL` environment variable

### Option 3: Docker

```bash
# Build API image
docker build -t nest-blog-api -f apps/api/Dockerfile apps/api

# Run API
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret-key-min-32-characters \
  nest-blog-api

# Build and serve Web (static files)
cd apps/web && pnpm build
# Serve dist/ with any static file server (nginx, Vercel, etc.)
```

## Testing

```bash
# All tests
pnpm test

# API unit tests
pnpm --filter @nest-blog/api test

# API E2E tests (requires running database)
pnpm test:e2e

# Coverage
pnpm test:cov
```

## Development Tips

### Adding a New API Endpoint

1. Create/update DTO in `apps/api/src/posts/dto/`
2. Add method to service interface
3. Implement in service
4. Add controller route with Swagger decorators
5. Update unit and E2E tests

### Adding a New Frontend Page

1. Create page component in `apps/web/src/pages/`
2. Add route in `apps/web/src/main.tsx`
3. Update navbar if needed

### Debugging

```bash
# API with debug
pnpm --filter @nest-blog/api start:debug

# Check database
docker exec -it nest-blog-postgres psql -U postgres -d nest_blog
```

## License

MIT
