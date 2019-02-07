import React, { Component, Fragment, lazy, Suspense } from 'react';
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

export class App extends Component<AppProps> {
  public componentDidMount() {
    this.updateCurrentApp();
  }

  public componentDidUpdate() {
    this.updateCurrentApp();
  }

  public componentWillUnmount() {
    this.props.changeCurrentApp('');
  }

  public render() {
    const { url } = this.props.match;

    return (
      <Fragment>
        <AppBar />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path={`${url}/global-search`} component={GlobalSearch} />
            <Route
              path={`${url}/species-selector`}
              component={SpeciesSelector}
            />
            <Route path={`${url}/browser`} component={Browser} />
          </Switch>
        </Suspense>
      </Fragment>
    );
  }

  private updateCurrentApp() {
    const name = this.props.location.pathname.replace('/app/', '');

    this.props.changeCurrentApp(name);
  }
}

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
