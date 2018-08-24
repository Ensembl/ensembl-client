import React, { Component } from 'react';
import { Switch, Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { hot } from 'react-hot-loader';

class TrackTwo extends Component {
  render() {
    return <h2>Content for Page 1 (Track 2)</h2>;
  }
}

export default hot(module)(TrackTwo);
