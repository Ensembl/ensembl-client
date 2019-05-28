import React, { useEffect, FunctionComponent, lazy, Suspense } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { changeCurrentApp } from 'src/header/headerActions';
import { getCurrentApp } from 'src/header/headerSelectors';

import { RootState } from 'src/store';

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

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = (props: AppShellProps) => {
  return <>{props.children}</>;
};

const AppInner = (props: AppProps) => {
  const { url } = props.match;

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

const mapStateToProps = (state: RootState): StateProps => ({
  currentApp: getCurrentApp(state)
});

const mapDispatchToProps: DispatchProps = {
  changeCurrentApp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
