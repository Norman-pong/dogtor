import { useMemo, useState } from "react";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { endpointSpecs } from "@dogtor/trpc/client";
import { z } from "zod";

function getPrimaryType(schema: any): string | undefined {
  const type = schema?.type;
  const pickType = (t: any) =>
    Array.isArray(t) ? (t.find((x: string) => x !== "null") ?? t[0]) : t;
  if (type) return pickType(type);
  if (schema?.anyOf) {
    const sub = schema.anyOf.find((s: any) => s.type && s.type !== "null");
    return sub ? getPrimaryType(sub) : undefined;
  }
  if (schema?.oneOf) {
    const sub = schema.oneOf.find((s: any) => s.type && s.type !== "null");
    return sub ? getPrimaryType(sub) : undefined;
  }
  return undefined;
}

function defaultValueForSchema(schema: any): any {
  if (!schema) return null;
  if (schema.default !== undefined) return schema.default;
  const t = getPrimaryType(schema);
  if (t === "string") return "";
  if (t === "number" || t === "integer") return 0;
  if (t === "boolean") return false;
  if (t === "object") {
    const props = schema.properties ?? {};
    return Object.fromEntries(
      Object.entries(props).map(([k, v]: [string, any]) => [
        k,
        defaultValueForSchema(v),
      ]),
    );
  }
  return null;
}

function InputFor({
  name,
  schema,
  value,
  onChange,
}: {
  name: string;
  schema: any;
  value: any;
  onChange: (v: any) => void;
}) {
  const t = getPrimaryType(schema);
  if (t === "string") {
    return (
      <input
        style={{ width: 220, padding: "6px 8px" }}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={name}
      />
    );
  }
  if (t === "number" || t === "integer") {
    return (
      <input
        type="number"
        style={{ width: 120, padding: "6px 8px" }}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={name}
      />
    );
  }
  if (t === "boolean") {
    return (
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }
  return <span>不支持的类型</span>;
}

export default function TRPCExplorer() {
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/trpc");
  const client = useMemo(() => {
    return createTRPCProxyClient<any>({
      links: [loggerLink(), httpBatchLink({ url: apiUrl })],
    });
  }, [apiUrl]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof endpointSpecs>();
    endpointSpecs.forEach((spec) => {
      const g = spec.group ?? "默认";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(spec);
    });
    return Array.from(map.entries()).map(([group, specs]) => ({
      group,
      specs,
    }));
  }, []);

  const [err, setErr] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});

  async function invoke(
    specKey: string,
    kind: "query" | "mutation",
    payload: any,
  ) {
    setErr(null);
    try {
      // 支持多段 key，如 users.list
      const segments = specKey.split(".");
      let cur: any = client;
      for (const seg of segments) cur = cur[seg];
      const res = await (kind === "query"
        ? cur.query(payload)
        : cur.mutate(payload));
      setResponses((prev) => ({ ...prev, [specKey]: res }));
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>tRPC 通用试炼场</h1>
      <p>根据端点规范自动生成表单与调用，减少重复改动。</p>

      <section style={{ marginTop: 16 }}>
        <h2>服务地址</h2>
        <input
          style={{ width: 420, padding: "6px 8px" }}
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:3000/trpc"
        />
      </section>

      <nav style={{ marginTop: 12 }}>
        <strong>模块目录：</strong>{" "}
        {grouped.map(({ group }) => (
          <a key={group} href={`#${group}`} style={{ marginRight: 12 }}>
            {group}
          </a>
        ))}
      </nav>

      {grouped.map(({ group, specs }) => (
        <section id={group} key={group} style={{ marginTop: 24 }}>
          <h2>{group}</h2>

          {specs.map((spec) => {
            const schema = spec.inputSchema;
            const json = schema ? z.toJSONSchema(schema) : null;

            const properties = json?.properties ?? null;
            const [form, setForm] = useState<any>(
              properties
                ? Object.fromEntries(
                    Object.entries(properties).map(([k, v]) => [
                      k,
                      defaultValueForSchema(v),
                    ]),
                  )
                : undefined,
            );
            return (
              <section
                key={spec.key}
                style={{
                  marginTop: 16,
                  borderTop: "1px solid #eee",
                  paddingTop: 12,
                }}
              >
                <h3 style={{ marginBottom: 8 }}>
                  {spec.key}{" "}
                  <small style={{ color: "#888", marginLeft: 8 }}>
                    [{spec.kind}] {spec.summary ?? ""}
                  </small>
                </h3>
                {properties ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {Object.entries(properties).map(([name, sch]) => (
                      <div
                        key={name}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <label style={{ minWidth: 60 }}>{name}:</label>
                        <InputFor
                          name={name}
                          schema={sch}
                          value={form?.[name]}
                          onChange={(val) =>
                            setForm((prev: any) => ({ ...prev, [name]: val }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#888" }}>无输入参数</div>
                )}
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => invoke(spec.key, spec.kind, form)}>
                    调用 {spec.key}
                  </button>
                </div>
                <div style={{ marginTop: 8 }}>
                  <pre style={{ background: "#f5f5f5", padding: 12 }}>
                    {responses[spec.key]
                      ? JSON.stringify(responses[spec.key], null, 2)
                      : "无响应"}
                  </pre>
                </div>
              </section>
            );
          })}
        </section>
      ))}

      {err ? (
        <section style={{ marginTop: 20 }}>
          <h2>错误</h2>
          <pre style={{ background: "#ffecec", padding: 12, color: "#b00000" }}>
            {err}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
