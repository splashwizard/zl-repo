import { h } from 'preact';
import { route, Router } from 'preact-router';
import { Provider } from 'react-redux';

import { Grommet, Main, ResponsiveContext } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';
import AppLoader from 'Components/AppLoader';
import store from './redux/store';

import { hasPermission } from './components/Authorize/index'

import zoolifeTheme from './style/theme';

import AdminRouter from './shared/AdminRouter';
import DesignSystem from './routes/designSystem';
import Login from './routes/login';
import Signup from './routes/signup';
import Map from './routes/map';

import './style/globalStyle.scss';

// Code-splitting is automated for `routes` directory
import Home from './routes/home';
import Habitat from './routes/habitat';
import Plans from './routes/plans';
import Profile from './routes/profile';

const customBreakpoints = deepMerge(grommet, zoolifeTheme)

const App = () => {
  const verifyRoutePermission = ({ active }) => {
    const [{ props: { permission } }] = active;

    if (!permission || hasPermission(permission)) {
      return;
    }

    route('/', true);
  }

  return (
    <Provider store={store}>
      <Grommet full theme={customBreakpoints} >
        <AppLoader />
        <ResponsiveContext.Consumer>
          {(size) => (
            <Main fill={size === 'large'}>
              <Router onChange={verifyRoutePermission}>
                <Home path="/" exact />
                <Habitat path="/habitat" permission="habitat:view" />
                <DesignSystem path="/design" />
                <Signup path="/signup" />
                <Login path="/login" />
                <AdminRouter path="/admin/:*" />
                <Plans path="/plans" />
                <Map path="/map" permission="map:view" />
                <Profile path="/profile" permission="profile:edit" />
              </Router>
            </Main>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Provider>
  );
};
export default App;
