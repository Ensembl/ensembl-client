import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import BrowserCanvas from '../../layout/browser/BrowserCanvas';
import { TrackOne, TrackTwo } from '../../../configs/tracks';

type BrowserParams = {};

type BrowserProps = RouteComponentProps<BrowserParams>;

type BrowserState = {};

const trackRoutes = (
  <Switch>
    <Route path="/app/browser/track/track-one" component={TrackOne} />
    <Route path="/app/browser/track/track-two" component={TrackTwo} />
  </Switch>
);

class Browser extends Component<BrowserProps, BrowserState> {
  public render() {
    return (
      <BrowserCanvas trackRoutes={trackRoutes}>
        <h2>Species Browser content area placeholder</h2>
      </BrowserCanvas>
    );
  }
}

export default hot(module)(Browser);
