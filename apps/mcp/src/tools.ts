import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";

export function registerTools(server: Server) {
  const tools = [
    {
      name: "health",
      description: "健康检查，返回 { ok: true }",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
    {
      name: "echo",
      description: "回显文本，参数 { text: string }",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string" },
        },
        required: ["text"],
        additionalProperties: false,
      },
    },
  ];

  // 列出工具
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  // 调用工具
  server.setRequestHandler(
    CallToolRequestSchema,
    async (req: CallToolRequest) => {
      const { name } = req.params;
      if (name === "health") {
        return {
          content: [{ type: "json", json: { ok: true, ts: Date.now() } }],
        };
      }
      if (name === "echo") {
        const text = String(req.params.arguments?.text ?? "");
        return {
          content: [{ type: "text", text }],
        };
      }
      throw new Error(`Unknown tool: ${name}`);
    },
  );
}
