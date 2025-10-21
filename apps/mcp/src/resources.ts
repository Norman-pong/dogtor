import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import fs from 'node:fs/promises';

import path from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';

// 计算 monorepo 根的 docs 目录（apps/mcp/src -> ../../../docs）

const DOCS_DIR_PATH = path.resolve(
  fileURLToPath(new URL('.', import.meta.url)),

  '../../../docs'
);

// 递归遍历 docs 目录，收集所有 .md 文件（跳过隐藏目录）

async function listMarkdownFilesRecursive(dir: string): Promise<string[]> {
  let dirents: any[] = [];

  try {
    // Node 18+ 支持 withFileTypes

    // @ts-ignore

    dirents = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const results: string[] = [];

  for (const d of dirents) {
    const name = d.name ?? String(d);

    if (name.startsWith('.')) continue; // 跳过隐藏目录/文件

    const full = path.join(dir, name);

    if (d.isDirectory?.()) {
      const nested = await listMarkdownFilesRecursive(full);

      results.push(...nested);
    } else if (d.isFile?.() && name.toLowerCase().endsWith('.md')) {
      results.push(full);
    } else if (!d.isDirectory?.()) {
      // 兼容不支持 Dirent 的平台：回退为普通文件判断

      if (name.toLowerCase().endsWith('.md')) results.push(full);
    }
  }

  return results;
}

export function registerResources(server: Server) {
  // 列出可用资源（递归 .md）

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const files = await listMarkdownFilesRecursive(DOCS_DIR_PATH);

    const resources = files.map((full) => ({
      uri: pathToFileURL(full).href,

      // 使用相对路径作为名称，便于区分子目录文件

      name: path.relative(DOCS_DIR_PATH, full).replace(/\\/g, '/'),

      mimeType: 'text/markdown'
    }));

    return { resources };
  });

  // 读取资源内容（只允许 docs 目录下的文件）

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const uri = req.params.uri;

    const targetUrl = new URL(uri);

    const targetPath = fileURLToPath(targetUrl);

    // 路径归一化 & 目录约束：必须在 DOCS_DIR_PATH 下

    const normalized = path.normalize(targetPath);

    // 更严格的目录边界判断：必须是 docs 的子路径

    const rel = path.relative(DOCS_DIR_PATH, normalized);

    const isUnderDocs = rel && !rel.startsWith('..') && !path.isAbsolute(rel);

    if (!isUnderDocs) {
      throw new Error('Resource not allowed');
    }

    const text = await fs.readFile(normalized, 'utf-8');

    return {
      contents: [
        {
          uri,

          mimeType: 'text/markdown',

          text
        }
      ]
    };
  });
}
