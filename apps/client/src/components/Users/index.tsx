import type { User } from "../../hooks/useUsers";

const Users = (props: {
  users: User[];
  loading: boolean;
  error: string | null;
}) => {
  const { users, loading, error } = props;
  return (
    <view className="Users">
      <text className="Subtitle">Users</text>
      {loading ? (
        <text className="Hint">Loading…</text>
      ) : error ? (
        <text className="Hint" style={{ color: "red" }}>
          {error}
        </text>
      ) : users.length > 0 ? (
        users.map((u) => (
          <text key={String(u.id)} className="Hint">
            {u.name} ({u.email})
          </text>
        ))
      ) : (
        <text className="Hint">No users.</text>
      )}
    </view>
  );
};

export default Users;
