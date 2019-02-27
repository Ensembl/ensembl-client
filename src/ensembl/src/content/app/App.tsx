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
    // remove /app/ first e.g. /app/browser/human/BRCA2 -> browser/human/BRCA2
    // then remove the part of the url that follows after the first / (forward slash) e.g. browser/human/BRCA2 -> browser
    const appName = props.location.pathname
      .replace('/app/', '')
      .replace(/\/(?<=\/).*$/, '');

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
            path={`${url}/browser/:species/:objSymbol/:location`}
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
