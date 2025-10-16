import { useEffect, useState } from '@lynx-js/react'
import { trpcClient } from '../../api/trpc'

export type User = { id: unknown; email: string; name: string }

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const client: typeof trpcClient = (globalThis as any).__trpcClientOverride ?? trpcClient
        const res = await client.users.list.query()
        if (!cancelled) setUsers(res?.users ?? [])
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('加载用户失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { users, loading, error }
}