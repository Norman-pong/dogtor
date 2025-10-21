# 如何开始

## 项目结构

```txt title="项目结构"
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

## MCP 服务

负责处理模型上下文协议（Model Context Protocol）的请求。

### 功能

- 提供模型上下文协议的服务端实现
- 支持模型上下文协议的客户端调用
- 支持模型上下文协议的插件扩展

### 配置

- 端口：6287
- 环境变量：
  - `CLIENT_PORT`：客户端端口，默认 6284
  - `SERVER_PORT`：服务端端口，默认 6287


## 与 AI 协同研发

本项目采用与 AI 协同研发的模式，将 AI 模型的上下文协议（Model Context Protocol）与项目的 MCP 服务进行集成。


## 国际化适配

使用 `i18n Ally` 插件能更好的辅助开发，国际化框架为 `react-i18next`

```txt title=shared-i18n
pnpm i -D @dogtor/shared-i18n
```

表单检验使用 zod 进行，prisma 错误需要调用后进行捕获，其余错误通过 shared-i18n 进行友好提示。

- trpc 中如何处理国际化字段？
    - 目前可通过 ctx 注入 locale、t 字段
    - 
- trpc 如何捕获 prisma 错误


```txt
dto   z.config(z.locales.zhCN())

```


