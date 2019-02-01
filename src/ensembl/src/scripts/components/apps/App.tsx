import React, { Component, Fragment } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';

import { changeCurrentApp } from '../../actions/headerActions';

const GlobalSearch = Loadable({
  loader: () => import('../apps/global-search/GlobalSearch'),
  loading: () => null
});

const SpeciesSelector = Loadable({
  loader: () => import('../apps/species-selector/SpeciesSelector'),
  loading: () => null
});

const Browser = Loadable({
  loader: () => import('../apps/browser/Browser'),
  loading: () => null
});

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

  public render() {
    const { url } = this.props.match;

    return (
      <Fragment>
        <Route path={`${url}/global-search`} component={GlobalSearch} />
        <Route path={`${url}/species-selector`} component={SpeciesSelector} />
        <Route path={`${url}/browser`} component={Browser} />
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
