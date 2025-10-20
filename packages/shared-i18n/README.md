# @dogtor/shared-i18n

集中管理多语言字段的共享包，采用 JSON 文件存储，符合 VS Code 插件 i18n Ally 的规范。

## 目录结构

```
packages/shared-i18n/
├─ package.json
├─ project.json
└─ locales/
   ├─ en.json      # 英文
   └─ zh-CN.json   # 简体中文
```

- 使用“按语言分文件”的结构（`locales/<locale>.json`），这是 i18n Ally 默认支持的模式。
- JSON 支持嵌套结构，例如：`users.create.success`。

## 使用约定

- 新增文案时，分别在各语言文件中补齐相同的 key。
- 建议采用模块化命名，例如：
  - `common.ok`、`common.cancel`
  - `users.list.title`、`users.create.success`

## 在编辑器中使用 i18n Ally

- 工作区已配置 `.vscode/settings.json`：
  - `i18n-ally.localesPaths`: 指向 `packages/shared-i18n/locales`
  - `i18n-ally.sourceLanguage`: `en`
- 推荐安装扩展：`lokalise.i18n-ally`（已在 `.vscode/extensions.json` 中声明）。
- 安装后，扩展会自动识别并提供：缺失键提示、快速编辑、翻译可视化等。

## 在代码中引用

- 如果需要在 TS/JS 中直接加载 JSON，可按需在消费端开启 `resolveJsonModule` 或依赖打包工具支持 JSON 导入。
- 也可以通过路径方式引用：`@dogtor/shared-i18n/locales/en.json`。

## 维护建议

- 保持 key 一致性，避免不同语言文件出现缺失或多余的键。
- 对于批量重命名或移动，可使用 i18n Ally 的“重构”能力，或一次性编辑两个 JSON。