import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
      <p style={{ margin: 0 }}>Counter: {count}</p>
      <button style={{ marginTop: 8 }} onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}
