#!/usr/bin/env bun

import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerTools } from './tools';

import { registerResources } from './resources';

// 声明 MCP 服务（启用 tools/resources 能力）

const server = new Server(
  { name: 'dogtor-mcp', version: '0.1.0' },

  { capabilities: { tools: {}, resources: {} } }
);

// 注册模块化处理器

registerTools(server);

registerResources(server);

// 启动 stdio 传输

const transport = new StdioServerTransport();

await server.connect(transport);

console.log("MCP server 'dogtor-mcp' connected via stdio");
