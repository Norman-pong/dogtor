# 如何开始


## 初始化项目

```bash
pnpx @modern-js/create@latest admin
pnpm create rspeedy@latest
```

### 结构

```
<root>
├─ package.json          # pnpm workspace 声明
├─ pnpm-workspace.yaml   # JS/TS 子包列表
├─ nx.json               # 任务图、缓存、runner 配置
├─ tsconfig.base.json    # 全局 TS path mapping
│
├─ apps
│  ├─ admin              # React 管理后台
│  ├─ client             # lynx 前端应用（独立部署）
│  ├─ api-bun            # Bun + Hono + Prisma
│  └─ container          # App 容器
│
├─ packages
│  ├─ shared-ts          # 前后端共享类型
│  ├─ shared-lynx        # lynx 专用组件 & utils
│  ├─ dto                # 数据传输对象（DTO）
│  └─ trpc               # trpc 客户端 & 服务端
│
├─ tools
│  ├─ docker             # 各服务 Dockerfile
│  └─ scripts            # 一键安装 protoc、go、llvm 等
│
└─ .github/workflows     # CI：Nx 云缓存 + 并行测试/构建/部署
```