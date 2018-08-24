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

const SpeciesBrowser = Loadable({
  loader: () => import('../apps/species-browser/SpeciesBrowser'),
  loading: () => null
});

class Content extends Component {
  render() {
    return (
      <main>
        <Route path="/app/globalsearch" component={GlobalSearch} />
        <Route path="/app/speciesselector" component={SpeciesSelector} />
        <Route path="/app/speciesbrowser" component={SpeciesBrowser} />
      </main>
    );
  }
}

export default Content;
