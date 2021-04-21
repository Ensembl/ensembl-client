/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, lazy, Suspense } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { changeCurrentApp } from 'src/header/headerActions';

import Header from 'src/header/Header';

const HomePage = lazy(() => import('../home/Home'));
const GlobalSearch = lazy(() => import('./global-search/GlobalSearch'));
const SpeciesSelector = lazy(
  () => import('./species-selector/SpeciesSelector')
);
const SpeciesPage = lazy(() => import('./species/SpeciesPage'));
const CustomDownload = lazy(() => import('./custom-download/CustomDownload'));
const Browser = lazy(() => import('./browser/Browser'));
const EntityViewer = lazy(() => import('./entity-viewer/EntityViewer'));
const About = lazy(() => import('./about/About'));

type AppProps = {
  changeCurrentApp: (name: string) => void;
};

const App = (props: AppProps) => {
  const location = useLocation();

  useEffect(() => {
    const appName: string = location.pathname.split('/').filter(Boolean)[0];

    props.changeCurrentApp(appName);

    return function unsetApp() {
      props.changeCurrentApp('');
    };
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={`/`} component={HomePage} exact />
          <Route path={`/global-search`} component={GlobalSearch} />
          <Route path={`/species-selector`} component={SpeciesSelector} />
          <Route path={`/species/:genomeId`} component={SpeciesPage} />
          <Redirect exact from="/species" to={urlFor.speciesSelector()} />
          <Route path={`/custom-download`} component={CustomDownload} />
          <Route
            path={`/entity-viewer/:genomeId?/:entityId?`}
            component={EntityViewer}
          />
          <Route path={`/genome-browser/:genomeId?`} component={Browser} />
          <Route path={`/about`} component={About} />
          <Route>
            <Redirect to={{ ...location, state: { is404: true } }} />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
};

const mapDispatchToProps = {
  changeCurrentApp
};

export default connect(null, mapDispatchToProps)(App);
