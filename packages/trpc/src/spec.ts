import { UserCreateDto, UserListQueryDto } from "@dogtor/dto";

export type EndpointSpec = {
  key: string; // 例如 'health'、'users.list'
  kind: "query" | "mutation";
  summary?: string;
  group?: string;
  inputSchema?: any;
};

export const endpointSpecs: EndpointSpec[] = [
  {
    key: "health",
    kind: "query",
    summary: "健康检查",
  },
  {
    key: "users.list",
    kind: "query",
    group: "users",
    summary: "获取用户列表",
    inputSchema: UserListQueryDto,
  },
  {
    key: "users.create",
    kind: "mutation",
    group: "users",
    summary: "创建用户",
    inputSchema: UserCreateDto.optional(),
  },
];
