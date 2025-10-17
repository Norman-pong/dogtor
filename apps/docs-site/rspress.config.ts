import { defineConfig } from 'rspress/config';
import path from 'path';

export default defineConfig({
  // 指向仓库根的 docs，不移动现有文档目录
  root: path.join(__dirname, '../../docs'),
  lang: 'zh-CN',
  i18nSourcePath: path.join(__dirname, '../../docs'),
  markdown: {
    globalComponents: [path.join(__dirname, 'src/components/Counter.tsx')],
  },

  // 允许 md/mdx 以及 .tsx 组件路由作为页面
  route: {
    extensions: ['.md', '.mdx', '.tsx', '.ts'],
  },

  themeConfig: {
    locales: [
      {
        lang: 'zh-CN',
        label: '中文',
        title: 'Dogtor 文档',

        outlineTitle: '目录',
        lastUpdated: true,
        lastUpdatedText: '最后更新时间',
        searchPlaceholderText: '搜索文档',
        sourceCodeText: '查看源代码',
        prevPageText: '上一页',
        nextPageText: '下一页',
        searchSuggestedQueryText: '搜索建议',
        searchNoResultsText: '没有搜索到结果',
        editLink: {
          text: '编辑此页',
          docRepoBaseUrl:
            'https://github.com/Norman-pong/dogtor/tree/main/docs/',
        },
      },
    ],
  },

  // 如需从 monorepo 包里引入组件，可设置别名（按需调整）
  builderConfig: {
    tools: {
      rspack: (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
          ...(config.resolve.alias || {}),
          // 示例别名，方便在 MDX/TSX 中引入共享代码
          '@shared-ts': path.join(__dirname, '../../packages/shared-ts/src'),
          '@shared-lynx': path.join(
            __dirname,
            '../../packages/shared-lynx/src',
          ),
          '@docs-site': path.join(__dirname, 'src'),
        };
        return config;
      },
    },
  },
});
