import Home from './pages/Home';

export function App(props: { onRender?: () => void }) {
  return <Home onRender={props.onRender} />;
}
