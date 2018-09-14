import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';

import { RootState } from '../../reducers';

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

type ContentParams = {};

type ContentProps = RouteComponentProps<ContentParams> & {
  launchbarExpanded: boolean;
};

class Content extends Component<ContentProps> {
  public render() {
    return (
      <main className={this.getMainClass()}>
        <Route path="/app/global-search" component={GlobalSearch} />
        <Route path="/app/species-selector" component={SpeciesSelector} />
        <Route path="/app/browser" component={Browser} />
      </main>
    );
  }

  private getMainClass(): string {
    if (this.props.launchbarExpanded === true) {
      return '';
    } else {
      return 'expanded';
    }
  }
}

const mapStateToProps = (state: RootState) => {
  const { launchbarExpanded } = state.header;
  return { launchbarExpanded };
};

export default withRouter(connect(mapStateToProps)(Content));
