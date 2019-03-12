import React, {
  FunctionComponent,
  Fragment,
  lazy,
  Suspense,
  useEffect
} from 'react';
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';

import { changeCurrentApp } from 'src/header/headerActions';
import { getCurrentApp } from 'src/header/headerSelectors';
import { RootState } from 'src/rootReducer';

import AppBar from './AppBar';

const GlobalSearch = lazy(() => import('./global-search/GlobalSearch'));
const SpeciesSelector = lazy(() =>
  import('./species-selector/SpeciesSelector')
);
const Browser = lazy(() => import('./browser/Browser'));

type StateProps = {
  currentApp: string;
};

type DispatchProps = {
  changeCurrentApp: (name: string) => void;
};

type OwnProps = {};

type AppProps = RouteComponentProps & StateProps & DispatchProps & OwnProps;

export const App: FunctionComponent<AppProps> = (props: AppProps) => {
  useEffect(() => {
    // remove /app/ from url to get app name
    let appName = props.location.pathname.replace('/app/', '');

    // check if app name still has forward slash (/) to be sure the app name is extracted
    // if it isn't then remove rest of the URL and extract the app name
    if (appName.indexOf('/') > -1) {
      const matches = appName.match(/^[^\/]*/);
      appName = matches ? matches[0] : '';
    }

    props.changeCurrentApp(appName);

    return function unsetApp() {
      props.changeCurrentApp('');
    };
  }, [props.match.path]);

  const { url } = props.match;

  return (
    <Fragment>
      <AppBar currentApp={props.currentApp} />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={`${url}/global-search`} component={GlobalSearch} />
          <Route path={`${url}/species-selector`} component={SpeciesSelector} />
          <Route
            path={`${url}/browser/:species/:stableId/`}
            component={Browser}
          />
        </Switch>
      </Suspense>
    </Fragment>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  currentApp: getCurrentApp(state)
});

const mapDispatchToProps: DispatchProps = {
  changeCurrentApp
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
