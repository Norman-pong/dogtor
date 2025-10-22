# 工作记录

使用 bun 作为包管理器。

## 初始化项目

```bash
# 初始化 admin app
bunx @modern-js/create@latest admin
# 初始化 client app
bunx create rspeedy@latest
```

## 使用 oxc 工具链进行代码约束

本项目采用 [oxc](https://github.com/oxc-project/oxc) 作为核心工具链，提供极速的 lint、format 与 transform 能力，统一代码风格并提前发现潜在问题。

### 1. 安装与初始化

```bash
# 安装 oxc 工具链
bun add -D @oxc-project/oxc-cli
# 初始化 oxc 配置文件
bunx oxc init
```

### 2. 配置 oxc 规则

```json title=.oxlintrc.json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [
    "unicorn",
    "typescript",
    "oxc"
  ],
  ...
}
```
