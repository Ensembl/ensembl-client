import React, {
  FunctionComponent,
  Fragment,
  lazy,
  Suspense,
  useEffect
} from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';

import { changeCurrentApp } from 'src/header/headerActions';
import AppBar from './AppBar';

const GlobalSearch = lazy(() => import('./global-search/GlobalSearch'));
const SpeciesSelector = lazy(() =>
  import('./species-selector/SpeciesSelector')
);
const Browser = lazy(() => import('./browser/Browser'));

type StateProps = {};

type DispatchProps = {
  changeCurrentApp: (name: string) => void;
};

type OwnProps = {};

type AppProps = RouteComponentProps & StateProps & DispatchProps & OwnProps;

export const App: FunctionComponent<AppProps> = (props: AppProps) => {
  useEffect(() => {
    const name = props.location.pathname.replace('/app/', '');

    props.changeCurrentApp(name);

    return function unsetApp() {
      props.changeCurrentApp('');
    };
  }, [props.location.pathname]);

  const { url } = props.match;

  return (
    <Fragment>
      <AppBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={`${url}/global-search`} component={GlobalSearch} />
          <Route path={`${url}/species-selector`} component={SpeciesSelector} />
          <Route path={`${url}/browser`} component={Browser} />
        </Switch>
      </Suspense>
    </Fragment>
  );
};

const mapStateToProps = (): StateProps => ({});

const mapDispatchToProps: DispatchProps = {
  changeCurrentApp
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
