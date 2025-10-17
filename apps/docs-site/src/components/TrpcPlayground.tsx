import { useMemo, useState } from 'react';
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@dogtor/trpc';

export default function TrpcPlayground() {
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/trpc');
  const client = useMemo(() => {
    return createTRPCProxyClient<AppRouter>({
      links: [loggerLink(), httpBatchLink({ url: apiUrl })],
    });
  }, [apiUrl]);

  const [health, setHealth] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);

  const [take, setTake] = useState<number>(10);
  const [users, setUsers] = useState<
    Array<{ id: number; email: string; name?: string | null }>
  >([]);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [createdUser, setCreatedUser] = useState<{
    id: number;
    email: string;
    name?: string | null;
  } | null>(null);

  async function pingHealth() {
    setErr(null);
    try {
      const res = await client.health.query();
      setHealth(JSON.stringify(res));
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  }

  async function fetchUsers() {
    setErr(null);
    try {
      const res = await client.users.list.query({ take });
      setUsers(res.users ?? []);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  }

  async function createUser() {
    setErr(null);
    try {
      const res = await client.users.create.mutate({ email, name: name });
      setCreatedUser(res.user);
      setEmail('');
      setName('');
      fetchUsers();
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>tRPC 试炼场（api-bun）</h1>
      <p>通过 tRPC 客户端直接调用 Bun API 的路由。</p>

      <section style={{ marginTop: 20 }}>
        <h2>服务地址</h2>
        <input
          style={{ width: 420, padding: '6px 8px' }}
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:3000/trpc"
        />
        <small style={{ display: 'block', marginTop: 6 }}>
          默认端口 3000，api-bun 通过 Hono 挂载在 /trpc
        </small>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>健康检查</h2>
        <button onClick={pingHealth}>Ping /health</button>
        <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 8 }}>
          {health}
        </pre>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>用户列表</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label>take:</label>
          <input
            type="number"
            value={take}
            onChange={(e) => setTake(Number(e.target.value))}
            style={{ width: 120, padding: '6px 8px' }}
          />
          <button onClick={fetchUsers}>查询</button>
        </div>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.email} {u.name ? `(${u.name})` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>创建用户</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: 240, padding: '6px 8px' }}
          />
          <input
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: 180, padding: '6px 8px' }}
          />
          <button onClick={createUser}>创建</button>
        </div>
        {createdUser ? (
          <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 8 }}>
            {JSON.stringify(createdUser, null, 2)}
          </pre>
        ) : null}
      </section>

      {err ? (
        <section style={{ marginTop: 20 }}>
          <h2>错误</h2>
          <pre style={{ background: '#ffecec', padding: 12, color: '#b00000' }}>
            {err}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
