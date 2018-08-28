import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class TrackTwo extends Component {
  public render() {
    return <h2>Content for Page 1 (Track 2)</h2>;
  }
}

export default hot(module)(TrackTwo);
