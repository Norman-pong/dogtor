import { useEffect, useState } from 'react';
import { Helmet } from '@modern-js/runtime/head';
import { trpcClient } from '@/api/trpc';
import './index.css';

const Index = () => (
  <div className="container-box">
    <Helmet>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <main>
      <HealthStatus />
      <CreateUserForm />
    </main>
  </div>
);

const HealthStatus = () => {
  const [status, setStatus] = useState<'unknown' | 'ok' | 'error'>('unknown')
  useEffect(() => {
    ;(async () => {
      try {
        // const res = await trpcClient.health.query()
        const res = await trpcClient.users.list.query()
        console.log(res)
        setStatus(res ? 'ok' : 'error')
      } catch {
        setStatus('error')
      }
    })()
  }, [])

  return (
    <p className="description" style={{ marginTop: 12 }}>
      API Health: {status === 'unknown' ? 'Checking…' : status.toUpperCase()}
    </p>
  )
}

export default Index;

const CreateUserForm = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      const res = await trpcClient.users.create.mutate({ email, name })
      setMessage(`Created user: ${res.user.name} (${res.user.email})`)
    } catch (err: any) {
      setError('Failed to create user')
      // Optionally log error details
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ marginTop: 16 }}>
      <h2>Create User</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Creating…' : 'Create'}
        </button>
      </div>
      {message && <p style={{ color: 'green', marginTop: 8 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </form>
  )
}
