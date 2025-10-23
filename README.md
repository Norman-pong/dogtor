# Dogtor

## Star History

ORM 库与后端服务框架对比

[![Star History Chart](https://api.star-history.com/svg?repos=drizzle-team/drizzle-orm,prisma/prisma,honojs/hono,elysiajs/elysia&type=date&legend=top-left)](https://www.star-history.com/#drizzle-team/drizzle-orm&prisma/prisma&honojs/hono&elysiajs/elysia&type=date&legend=top-left)

## Fork & CI 部署指南（Cloudflare Workers + D1）

本项目的 API 使用 Cloudflare Workers + D1，并通过 CI 注入域名与数据库 ID，便于他人 fork 后快速部署。

### 前置要求
- 拥有 Cloudflare 账号与目标域名的 DNS 管理权（该域名需在 Cloudflare Zone 中）。
- 已启用 Cloudflare Workers 与 D1。
- GitHub 仓库有权限设置 Variables 与 Secrets。

### 需要在 GitHub 仓库设置的变量
到 `Settings → Secrets and variables → Actions → Variables` 新增以下变量（非敏感）：
- `PROD_DOMAIN`: 生产环境域名（仅主机名，不含协议），例如 `api.example.com`
- `TEST_DOMAIN`: 测试环境域名（仅主机名），例如 `api-staging.example.com`
- `D1_DATABASE_ID_PROD`: 生产 D1 的 `database_id`
- `D1_DATABASE_ID_TEST`: 测试 D1 的 `database_id`

到 `Settings → Secrets and variables → Actions → Secrets` 新增以下密钥（敏感）：
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token（需包含 Workers 与 D1 权限）
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账户 ID

提示：`database_id` 可通过 `wrangler d1 list` 查看，或在 `wrangler d1 create <name>` 输出中获取。

### 首次部署步骤
1. 创建 D1 数据库（测试与生产各一份）：
   - `bunx wrangler d1 create dogtor-test`
   - `bunx wrangler d1 create dogtor-prod`
   - 使用 `bunx wrangler d1 list` 获取两个库的 `database_id`，填到上面的仓库变量中。
2. 确保域名已在 Cloudflare DNS 管理：`PROD_DOMAIN` 和 `TEST_DOMAIN` 必须属于你的 Cloudflare Zone。
3. 推送到 `main` 分支，会触发 `.github/workflows/cf-workers.yml`：
   - CI 会将 `apps/api-bun/wrangler.toml` 中的占位符替换为你的变量值：
     - `__PROD_DOMAIN__`、`__TEST_DOMAIN__`
     - `__D1_DATABASE_ID_PROD__`、`__D1_DATABASE_ID_TEST__`、`__D1_DATABASE_ID_DEFAULT__`
   - 应用 D1 迁移（生产）：`bunx wrangler d1 migrations apply DB --config apps/api-bun/wrangler.toml --remote --env production`
   - 部署生产环境：`bunx wrangler deploy --config apps/api-bun/wrangler.toml --env production`

### 本地开发（测试环境）
- 启动本地：`bunx wrangler dev --config apps/api-bun/wrangler.toml --env test`
- 本地应用迁移（可选）：`bunx wrangler d1 migrations apply DB --config apps/api-bun/wrangler.toml --local --env test`
- 说明：`[env.test]` 保留 `workers_dev = true`，支持 `*.workers.dev` 预览；`route` 配置仅用于绑定自定义域名，不影响本地预览。

### 工作流注入机制说明
- Wrangler 不支持在 `wrangler.toml` 中直接使用环境变量插值，因此在 CI 中使用 `sed` 将占位符替换为仓库变量值。
- 项目已在 `wrangler.toml` 中添加如下占位符：
  - 顶层 `[[d1_databases]]` 的 `database_id = "__D1_DATABASE_ID_DEFAULT__"`（用于类型生成，本地可替换为测试库 ID）。
  - `[env.test]` 与 `[env.production]` 的 `route` 和 `[[env.*.d1_databases]]` 的 `database_id` 分别使用对应占位符。

### 常见问题
- 路由绑定失败：检查 `PROD_DOMAIN`/`TEST_DOMAIN` 是否在你的 Cloudflare Zone 内；确认 `CLOUDFLARE_ACCOUNT_ID` 与 Token 权限有效。
- D1 绑定或迁移报错：确保 CI 已正确注入 `database_id`（查看 Action 日志），并使用绑定名 `DB` 进行迁移与访问。
- 需要部署测试环境：可在工作流中新增一个 `--env test` 的 Job，或本地运行 `bunx wrangler deploy --env test`（先替换占位符）。