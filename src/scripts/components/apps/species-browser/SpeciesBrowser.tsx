import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import Browser from '../../layout/browser/Browser';
import { TrackOne, TrackTwo } from '../../../configs/tracks';

type SpeciesBrowserParams = {};

type SpeciesBrowserProps = RouteComponentProps<SpeciesBrowserParams>;

type SpeciesBrowserState = {};

const trackRoutes = (
  <Switch>
    <Route path="/app/speciesbrowser/track/track-one" component={TrackOne} />
    <Route path="/app/speciesbrowser/track/track-two" component={TrackTwo} />
  </Switch>
);

class SpeciesBrowser extends Component<SpeciesBrowserProps, SpeciesBrowserState> {
  public render() {
    return (
      <Browser trackRoutes={trackRoutes}>
        <h2>Species Browser content area placeholder</h2>
      </Browser>
    );
  }
}

export default hot(module)(SpeciesBrowser);
