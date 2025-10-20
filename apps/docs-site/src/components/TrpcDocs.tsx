import { endpointSpecs } from '@dogtor/trpc/client';
import { z } from 'zod';

export default function TrpcDocs() {
  return (
    <div style={{ padding: 24 }}>
      <h1>tRPC 接口文档</h1>
      <p>根据端点规范与 Zod schema 自动生成接口文档。</p>

      {endpointSpecs.map((spec) => {
        const schema = spec.inputSchema;
        const jsonSchema = schema ? z.toJSONSchema(schema) : null;

        return (
          <section
            key={spec.key}
            style={{
              marginTop: 24,
              borderTop: '1px solid #eee',
              paddingTop: 16,
            }}
          >
            <h3 style={{ marginBottom: 8 }}>
              {spec.key}{' '}
              <small style={{ color: '#888', marginLeft: 8 }}>
                [{spec.kind}] {spec.summary ?? ''}
              </small>
            </h3>
            <div>
              <strong>分组：</strong> {spec.group ?? '默认'}
            </div>
            <div style={{ marginTop: 8 }}>
              <strong>请求参数：</strong>
              {jsonSchema ? (
                <pre style={{ background: '#f5f5f5', padding: 12 }}>
                  {JSON.stringify(jsonSchema.properties, null, 2)}
                </pre>
              ) : (
                <span style={{ color: '#888' }}>无输入参数</span>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
