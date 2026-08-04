# 🎓 Lumina Tutorial

A hands-on, top-to-bottom walkthrough for building with Lumina. If you're looking for the full API/config reference, see [README.md](./README.md) — this document is task-oriented: it walks you through actually using the boilerplate to ship something.

**Who this is for:** developers who just cloned or scaffolded a Lumina project and want to go from zero to a working authenticated feature and a new page, without hunting through source files.

**Prerequisites:** Node.js 18+, a running MySQL/PostgreSQL/MariaDB/SQLite server, and basic familiarity with Express and React.

---

## Table of Contents

- [1. Getting Started](#1-getting-started)
- [2. Project Tour](#2-project-tour)
- [3. Authentication Walkthrough](#3-authentication-walkthrough)
- [4. Building a New Feature End-to-End](#4-building-a-new-feature-end-to-end)
- [5. Building a New Inertia Page](#5-building-a-new-inertia-page)
- [6. Code Generators Reference](#6-code-generators-reference)
- [7. Maintenance Mode](#7-maintenance-mode)
- [8. Testing](#8-testing)
- [9. Production Deployment](#9-production-deployment)
- [10. Troubleshooting](#10-troubleshooting)

---

## 1. Getting Started

```bash
# Option A: scaffold a fresh project
npm create lumina-project@latest
cd my-lumina-app
npm install

# Option B: clone this repo directly
git clone <your-repo-url>
cd lumina
npm install
```

Generate your secrets. This copies `.env.example` to `.env` (if `.env` doesn't already exist), then writes a random 64-character `JWT_SECRET` and `MAINTENANCE_SECRET` into it:

```bash
npm run key:generate
```

> ⚠️ Running this command again **overwrites** the existing `JWT_SECRET`/`MAINTENANCE_SECRET` in `.env`. Regenerating it invalidates every access token already issued (users will need to log in again), though stored refresh tokens in the database remain valid since they aren't JWTs.

Open `.env` and set your database connection (`DB_DIALECT`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, etc.) — see [README.md's Configuration section](./README.md#configuration) for the full variable list. Then create the database itself (Lumina's migration runner will also auto-create it for MySQL/Postgres if it doesn't exist yet).

Run migrations and seed in one step:

```bash
npm run migrate:seed
```

This creates all tables and seeds:
- **1 admin user** — `admin@lumina.com` / `lumina123` (`role: 'admin'`)
- **20 fake users** — generated with Faker.js, all `role: 'user'`

> 📝 **Known seeding quirk:** the 20 fake users are created via Sequelize's `bulkCreate` (through the factory's `createMany`), which **skips model hooks** — including the `beforeCreate` hook that bcrypt-hashes the `password` field. Only the single admin user (created via `create()`) gets a real, loggable-in password. Don't be surprised if logging in as one of the random seeded users doesn't work; if you need more real test accounts, create them individually through `UserFactory.create(...)` or the `POST /api/users` endpoint instead.

Start the dev server (Express + Vite, both with hot reload):

```bash
npm run dev
```

| URL | What you'll see |
|---|---|
| `http://localhost:3000` | Welcome page |
| `http://localhost:3000/status` | System status dashboard |
| `http://localhost:3000/health` | Health check JSON (for uptime monitors / container probes) |

---

## 2. Project Tour

Lumina is one Express app that serves both a JSON API (`/api/*`) and server-rendered React pages via Inertia.js (everything else). The main folders you'll touch:

| Folder | What lives here |
|---|---|
| `src/controllers/` | Thin HTTP handlers — parse request, call a service, format response |
| `src/services/` | Business logic and DB queries (singleton classes) |
| `src/models/` | Sequelize models, all extending `BaseModel` (soft delete + timestamps + snake_case built in) |
| `src/middlewares/` | Auth, validation, rate limiting, CSRF, role checks, etc. |
| `src/requests/` | Zod validation schemas, one class per resource |
| `src/routes/` | `api.ts` (JSON API) and `web.ts` (Inertia pages) |
| `src/database/` | Migrations, factories, seeders |
| `resources/js/Pages/` | React components rendered by Inertia |
| `scripts/` | CLI code generators and one-off maintenance scripts |

For the exhaustive file-by-file structure, see [README.md's Project Structure](./README.md#project-structure). The rest of this tutorial shows how these pieces actually get used together.

---

## 3. Authentication Walkthrough

Lumina uses **JWT access tokens + opaque refresh tokens**, not sessions.

### Log in

```http
POST /api/login
Content-Type: application/json

{ "email": "admin@lumina.com", "password": "lumina123" }
```

You get back:

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "firstname": "Admin", "email": "admin@lumina.com", "role": "admin", "avatar": null },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "a1b2c3d4e5f6..."
  }
}
```

- **`accessToken`** is a real JWT signed with `JWT_SECRET`, containing `{ id, email, role }`. Short-lived (`JWT_EXPIRES_IN`, default 15 minutes).
- **`refreshToken`** is *not* a JWT — it's a random 64-byte hex string, stored in the `refresh_tokens` table (`src/models/RefreshToken.ts`) with an expiry (`JWT_REFRESH_EXPIRES_IN`, default 7 days). This is what lets a client get new access tokens without re-entering credentials.

### Call a protected endpoint

```http
GET /api/me
Authorization: Bearer eyJhbGciOi...
```

`ApiAuth` (`src/middlewares/ApiAuth.ts`) verifies the JWT and populates `req.user` with the decoded payload — `me` just echoes it back, it does not re-fetch from the DB.

### Refreshing an expired access token

```http
POST /api/refresh
Content-Type: application/json

{ "refreshToken": "a1b2c3d4e5f6..." }
```

Returns a fresh `accessToken` only — **the refresh token itself is not rotated**, it stays valid until it naturally expires or you log out. This means a leaked refresh token remains usable for its full lifetime; keep that in mind if you're storing it somewhere client-side.

**Silent refresh** happens automatically in two different ways depending on which middleware guards your route:
- **`ApiAuth`** (for `/api/*` routes, Bearer-token clients): if the access token is expired but a refresh token is supplied via `x-refresh-token` header or a `refresh_token` cookie, it transparently mints a new access token and returns it in the `X-New-Access-Token` response header. Your API client should check for this header and update its stored token.
- **`WebAuth`** (for server-rendered Inertia pages, cookie-only): same idea, but it re-issues the `access_token` cookie directly instead of a header — nothing for the frontend to do manually.

Pick whichever middleware matches how the route is consumed — don't mix them on the same route.

### Logging out

```http
POST /api/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{ "refreshToken": "a1b2c3d4e5f6..." }
```

This sets `revoked = true` on that refresh token row (a soft revoke, not a delete) — it will no longer work for `/api/refresh`.

### Restricting a route by role

`RoleGuard` (`src/middlewares/RoleGuard.ts`) gates a route to specific roles. It must run **after** `ApiAuth.handle`, since it reads `req.user.role`:

```typescript
// src/routes/api.ts
protectedRouter.use(ApiAuth.handle);
protectedRouter.get('/users', RoleGuard.allow('admin'), UserController.index);
```

A logged-in user whose role isn't in the allowed list gets a `403 Forbidden`. This is exactly how `/api/users` is locked down today — use it as your template for any other admin-only resource.

> 📝 A few things Lumina doesn't ship yet: refresh-token rotation/reuse-detection, password-reset, and email-verification flows. These are legitimate gaps to close before a real production launch — see the Authentication & Security section of [README.md](./README.md#authentication--security) for more context. This tutorial just documents what exists today.

---

## 4. Building a New Feature End-to-End

Let's build a `Post` resource — a simple "each user owns their own posts" CRUD API, restricted to authenticated users (not admin-only). This mirrors exactly how `User` is implemented, so keep `src/models/User.ts`, `src/services/UserService.ts`, and `src/controllers/UserController.ts` open for reference as we go.

### Step 1 — Generate the model

```bash
npm run create:model Post
```

This creates `src/models/Post.ts` with just an `id` column. Edit it to extend `BaseModel` (for automatic soft-delete/timestamps/snake_case) and add your columns and the ownership association:

```typescript
import { DataTypes, Sequelize, Optional } from 'sequelize';
import BaseModel from './BaseModel.js';

interface PostAttributes {
  id: number;
  user_id: number;
  title: string;
  body: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

class Post extends BaseModel<PostAttributes, PostCreationAttributes> implements PostAttributes {
  declare id: number;
  declare user_id: number;
  declare title: string;
  declare body: string;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at?: Date | null;

  static initModel(sequelize: Sequelize) {
    Post.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        body: { type: DataTypes.TEXT, allowNull: false },
      },
      { sequelize, modelName: 'Post', tableName: 'posts' }
    );
  }

  static associate(models: any) {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Post;
```

No manual registration step needed — `src/models/index.ts` auto-discovers any model file exporting a class with `initModel`.

### Step 2 — Generate the migration

```bash
npm run create:migration create_posts
```

The generator scans `src/models/Post.ts` and auto-derives the migration's columns, including a foreign key + `references`/`onDelete: CASCADE` for the `belongsTo(User)` association it detected. Review the generated file in `src/database/migrations/`, then run it:

```bash
npm run migrate
```

> 💡 Building several related models at once? `npm run create:migration all` generates migrations for every model in `src/models/`, topologically sorted so foreign-key dependencies migrate in the right order.

### Step 3 — Validation schema

Create `src/requests/PostRequest.ts`, following the same pattern as `src/requests/UserRequest.ts`:

```typescript
import { z } from 'zod';

class PostRequest {
  public static store = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    body: z.string().min(1, 'Body is required'),
  });

  public static update = z.object({
    title: z.string().min(3).optional(),
    body: z.string().min(1).optional(),
  });
}

export default PostRequest;
```

**Important:** don't add `user_id` to this schema. The owner always comes from `req.user.id` (populated by `ApiAuth`), never from client-supplied input — this is the same mass-assignment discipline `UserRequest`/`Validator` already enforce for `role` on the `User` model.

### Step 4 — Service

Create `src/services/PostService.ts`, mirroring `src/services/UserService.ts` and reusing the existing `Paginator` utility:

```typescript
import Post, { PostCreationAttributes } from '../models/Post.js';
import Paginator from '../utils/Paginator.js';

class PostService {
  public async getAllPosts(userId: number, page: number, limit: number) {
    return await Paginator.paginate(Post, page, limit, {
      where: { user_id: userId },
      order: [['id', 'DESC']],
    });
  }

  public async createPost(userId: number, data: Omit<PostCreationAttributes, 'user_id'>) {
    return await Post.create({ ...data, user_id: userId });
  }

  public async updatePost(userId: number, postId: number, data: Partial<PostCreationAttributes>) {
    const post = await Post.findOne({ where: { id: postId, user_id: userId } });
    if (!post) throw new Error('Post not found');
    Object.assign(post, data);
    return await post.save();
  }

  public async deletePost(userId: number, postId: number) {
    const post = await Post.findOne({ where: { id: postId, user_id: userId } });
    if (!post) throw new Error('Post not found');
    return await post.destroy(); // soft delete, via BaseModel's paranoid: true
  }
}

export default new PostService();
```

Note the `where: { id, user_id }` scoping on update/delete — this enforces that a user can only touch their own posts.

### Step 5 — Controller

```bash
npm run create:controller Post
```

Edit the generated `src/controllers/PostController.ts` (it already has `index/store/show/update/destroy` stubs) to delegate to `PostService`, following `UserController.ts`'s pattern:

```typescript
public async index(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const posts = await PostService.getAllPosts(req.user!.id, page, limit);
    return ApiResponse.success(res, posts, 'Posts retrieved successfully');
  } catch (error) {
    next(error);
  }
}

public async store(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await PostService.createPost(req.user!.id, req.body);
    return ApiResponse.success(res, post, 'Post created successfully', 201);
  } catch (error) {
    next(error);
  }
}
```

### Step 6 — Routes

Add these inside the existing `protectedRouter` group in `src/routes/api.ts` (already behind `ApiAuth.handle` — no `RoleGuard` needed since any logged-in user can manage their own posts):

```typescript
import PostController from '../controllers/PostController.js';
import PostRequest from '../requests/PostRequest.js';

protectedRouter.get('/posts', PostController.index);
protectedRouter.post('/posts', Validator.validate(PostRequest.store), PostController.store);
protectedRouter.get('/posts/:id', PostController.show);
protectedRouter.put('/posts/:id', Validator.validate(PostRequest.update), PostController.update);
protectedRouter.delete('/posts/:id', PostController.destroy);
```

### Step 7 — Try it

```bash
# 1. Log in and grab an access token
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lumina.com","password":"lumina123"}'

# 2. Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first post","body":"Hello Lumina"}'

# 3. List your posts
curl http://localhost:3000/api/posts -H "Authorization: Bearer <accessToken>"
```

That's the whole loop: generator → model → migration → validation → service → controller → route. Every resource in Lumina follows this same shape.

---

## 5. Building a New Inertia Page

Inertia pages don't need a separate API — the controller renders a named React component directly with props, no client-side data fetching required.

### Step 1 — Route

```typescript
// src/routes/web.ts
this.router.get('/dashboard', WebController.dashboard);
```

### Step 2 — Controller method

```typescript
// src/controllers/WebController.ts
public async dashboard(req: Request, res: Response) {
  return res.inertia('Dashboard', { widgets: ['posts', 'profile'] });
}
```

### Step 3 — Matching React page

The string passed to `res.inertia(...)` must exactly match a file path under `resources/js/Pages/` (including subfolders — `res.inertia('Admin/Dashboard', ...)` needs `resources/js/Pages/Admin/Dashboard.tsx`). Create `resources/js/Pages/Dashboard.tsx`:

```tsx
import { usePage } from '@inertiajs/react';

interface DashboardProps {
  widgets: string[];
}

interface SharedProps {
  auth: { user: { id: number; email: string; role: string } | null };
  flash: { success: string | null; error: string | null; info: string | null; warning: string | null };
}

export default function Dashboard({ widgets }: DashboardProps) {
  const { auth, flash } = usePage<SharedProps>().props;

  return (
    <div>
      <h1>Welcome, {auth.user?.email}</h1>
      {flash.success && <p>{flash.success}</p>}
      <ul>{widgets.map((w) => <li key={w}>{w}</li>)}</ul>
    </div>
  );
}
```

No build config or manual registration needed — `resources/js/app.tsx` eager-loads every file under `Pages/**/*.tsx` via `import.meta.glob`, so a new file is picked up automatically on the next dev-server reload or build.

**Shared props, free on every page:** `auth.user`, `flash.{success,error,info,warning}`, and `errors` are injected globally by `InertiaMiddleware` — you never need to pass them manually from a controller. To set a flash message before rendering or redirecting:

```typescript
res.flash('success', 'Post created!');
```

**Forms:** none of the existing pages use Inertia's `useForm()` yet, but it's the standard way to submit data with automatic validation-error binding:

```tsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({ title: '', body: '' });

function submit(e: React.FormEvent) {
  e.preventDefault();
  post('/posts');
}
```

Validation errors thrown by `Validator.validate(...)` on the server are automatically flashed back and show up in this same `errors` object.

**Styling note:** there's no Tailwind or CSS framework configured — just plain CSS in `resources/css/app.css` with some reusable utility classes (`.card`, `.btn`, etc.) used by the existing example pages. Reuse those classes for a consistent look, or add your own. There's also no `@/` path alias configured in `vite.config.ts` — imports between `resources/js/` files must be relative.

---

## 6. Code Generators Reference

All generators live in `scripts/*.ts` and write from templates in `scripts/stubs/*.stub`. Run them via the `npm run` scripts below — **not** the usage text the scripts print to the console (a leftover naming mismatch means their own `--help`-style output says `make:model`/`make:controller`/`make:factory`, but the real, working commands are the `create:*` ones defined in `package.json`).

| Command | Creates | Notes |
|---|---|---|
| `npm run create:model <Name>` | `src/models/<Name>.ts` | Only scaffolds an `id` column — add the rest yourself. Doesn't extend `BaseModel` by default; change it manually if you want soft-delete/timestamps (as shown in [Section 4](#4-building-a-new-feature-end-to-end)). |
| `npm run create:migration <name>` | `src/database/migrations/<timestamp>-<name>.js` | If a matching model exists in `src/models/`, it **scans the model file** and auto-generates columns, types, and `belongsTo` foreign keys. Falls back to a blank stub if no model is found. |
| `npm run create:migration all` | One migration per model | Topologically sorts by foreign-key dependency so referenced tables migrate first. |
| `npm run create:controller <Name>` | `src/controllers/<Name>Controller.ts` | Auto-appends `Controller` to the name if missing (`Post` → `PostController`). Scaffolds `index/store/show/update/destroy` stubs. |
| `npm run create:factory <Name>` | `src/database/factories/<Name>Factory.ts` | Auto-appends `Factory`, guesses the model name by stripping the suffix. `definition()` is left commented out — fill it in with `faker.*` calls (see `src/database/factories/UserFactory.ts` for a real example). |

Other useful scripts:

| Command | What it does |
|---|---|
| `npm run migrate` / `migrate:undo` / `migrate:reset` | Run pending migrations / roll back one / roll back and re-run everything |
| `npm run migrate:seed` | Run pending migrations, then seed — the "fresh setup" shortcut |
| `npm run db:seed` | Run seeders only (assumes migrations are already applied) |
| `npm run key:generate` | Generate/overwrite `JWT_SECRET` and `MAINTENANCE_SECRET` in `.env` |

---

## 7. Maintenance Mode

```bash
npm run down   # creates maintenance.lock — all requests get a 503 Maintenance page/JSON
npm run up     # deletes maintenance.lock — back online
```

The `Maintenance` middleware checks for `maintenance.lock` at the project root on every request; bypass it during an incident by sending the `X-Bypass-Maintenance` header with your `MAINTENANCE_SECRET`.

---

## 8. Testing

```bash
npm test              # run the full suite once
npx vitest             # watch mode
npx vitest src/tests/hash.test.ts   # a single file
```

Tests live in `src/tests/`. Today's suite covers utility-level behavior only (password hashing, API response shape, env validation) — there's no controller/service/auth-flow coverage yet. Follow the existing files as a pattern (plain `describe`/`it`/`expect` via Vitest) when adding tests for a new feature like the `Post` resource from Section 4.

---

## 9. Production Deployment

See [README.md's Production Deployment section](./README.md#-production-deployment) for the full build/env/PM2 walkthrough — the short version:

```bash
npm run key:generate   # fresh secrets before going live
npm run build          # tsc + vite build → dist/ and public/build/
node dist/server.js    # or: pm2 start dist/server.js --name lumina
```

Use `GET /health` as your liveness/readiness probe target if you're behind an orchestrator or load balancer.

> There's no Dockerfile or CI/CD pipeline included in this boilerplate today — containerization and pipeline setup (tests/lint/build-on-push) are left to the adopting project.

---

## 10. Troubleshooting

See [README.md's Troubleshooting section](./README.md#-troubleshooting) for fixes to common issues (env validation failures, DB connection errors, CSRF 403s, rate limiting, port conflicts, and more).
