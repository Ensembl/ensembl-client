import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';

const PageOne = Loadable({
  loader: () => import('./PageOne'),
  loading: () => null
});

const PageTwo = Loadable({
  loader: () => import('./PageTwo'),
  loading: () => null
});

const PageThree = Loadable({
  loader: () => import('./PageThree'),
  loading: () => null
});

class TrackOne extends Component {
  public render() {
    return (
      <div className="track-page-wrapper track-one">
        <Switch>
          <Redirect from="/app/speciesbrowser/track/track-one" exact={true} to="/app/speciesbrowser/track/track-one/page-one" />
          <Route path="/app/speciesbrowser/track/track-one/page-one" component={PageOne} />
          <Route path="/app/speciesbrowser/track/track-one/page-two" component={PageTwo} />
          <Route path="/app/speciesbrowser/track/track-one/page-three" component={PageThree} />
        </Switch>
      </div>

    );
  }
}

export default hot(module)(TrackOne);
