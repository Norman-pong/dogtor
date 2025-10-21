import { useEffect } from '@lynx-js/react';

import Banner from '../components/Banner';

import Content from '../components/Content';

import Users from '../components/Users';

import { useUsers } from '../hooks/useUsers';

import '../App.css';

export default function Home(props: { onRender?: () => void }) {
  useEffect(() => {
    console.info('Hello, ReactLynx');

    props.onRender?.();
  }, []);

  const { users, loading, error } = useUsers();

  return (
    <view>
      <view className="Background" />
      <view className="App">
        <Banner />
        <Content />
        <Users users={users} loading={loading} error={error} />
        <view style={{ flex: 1 }} />
      </view>
    </view>
  );
}
