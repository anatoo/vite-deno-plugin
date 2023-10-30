import { Route, Link, Switch } from 'wouter';
import "./App.css";

function App() {
  return <>
    <h1>Deno + Vite + React</h1>
    <div>
      <Link href="/">Home</Link>&nbsp;
      <Link href="/about">About</Link>
    </div>
    <br />
    <div className="main">
      <Switch>
        <Route path="/">This is "/" page</Route>
        <Route path="/about">This is "/about" page</Route>
      </Switch>
    </div>
  </>;
}

export default App;
