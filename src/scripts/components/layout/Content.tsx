import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

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

class Content extends Component {
  public render() {
    return (
      <main>
        <Route path="/app/global-search" component={GlobalSearch} />
        <Route path="/app/species-selector" component={SpeciesSelector} />
        <Route path="/app/browser" component={Browser} />
      </main>
    );
  }
}

export default Content;
