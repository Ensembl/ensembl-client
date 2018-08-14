import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

const GlobalSearch = Loadable({
  loader: () => import('../apps/GlobalSearch'),
  loading: () => null
});

const SpeciesSelector = Loadable({
  loader: () => import('../apps/SpeciesSelector'),
  loading: () => null
});

class Content extends Component {
  render() {
    return (
      <main>
        <Route path="/app/globalsearch" component={GlobalSearch} />
        <Route path="/app/speciesselector" component={SpeciesSelector} />
      </main>
    );
  }
}

export default Content;
