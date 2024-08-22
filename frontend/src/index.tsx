import 'uno.css';
import './global.css';

import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";

import '@unocss/reset/sanitize/sanitize.css'
import '@unocss/reset/sanitize/assets.css'

import Home from './pages/Home';
import Schedules from './pages/Schedules';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Overview from './pages/Overview';
import Unknown from './pages/Unknown';
import Users from './pages/Users';
import { RouteGuard } from './components/RouteGuard';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
    () => (
        <Router>
            <Route path="/" component={Home} />
            <Route path="/schedules" component={Schedules} />
            <Route path="/login" component={Login} />
            {/* Use RouteGuard for protected routes */}
            <Route path="/admin" component={() => (
                <RouteGuard>
                    <Admin />
                </RouteGuard>
            )} />
            <Route path="/overview" component={() => (
                <RouteGuard>
                    <Overview />
                </RouteGuard>
            )} />
            <Route path="/users" component={() => (
                <RouteGuard>
                    <Users />
                </RouteGuard>
            )} />
            <Route path="/*" component={Unknown} />
        </Router>
    ),
    root!,
);

