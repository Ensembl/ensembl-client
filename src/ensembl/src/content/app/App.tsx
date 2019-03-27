import React, { FunctionComponent, Fragment, lazy, Suspense } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import AppBar from './AppBar';

const GlobalSearch = lazy(() => import('./global-search/GlobalSearch'));
const SpeciesSelector = lazy(() =>
  import('./species-selector/SpeciesSelector')
);
const Browser = lazy(() => import('./browser/Browser'));

type StateProps = {};

type DispatchProps = {};

type OwnProps = {};

type AppProps = RouteComponentProps & StateProps & DispatchProps & OwnProps;

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = (props: AppShellProps) => {
  return (
    <Fragment>
      <AppBar />
      {props.children}
    </Fragment>
  );
};

const AppInner = (props: AppProps) => {
  const { url } = props.match;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path={`${url}/global-search`} component={GlobalSearch} />
        <Route path={`${url}/species-selector`} component={SpeciesSelector} />
        <Route
          path={`${url}/browser/:species/:stableId/`}
          component={Browser}
        />
        <Redirect
          exact={true}
          from={`${url}/browser`}
          to={{
            pathname: `${url}/browser/GRCh38_demo/ENSG00000139618`,
            search: '?region=13:32271473-32437359'
          }}
        />
      </Switch>
    </Suspense>
  );
};

export const App: FunctionComponent<AppProps> = (props: AppProps) => {
  return (
    <AppShell>
      <AppInner {...props} />
    </AppShell>
  );
};

export default App;
