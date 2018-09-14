import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class TrackTwo extends Component {
  public render() {
    return (
      <div className="track-section-wrapper track-two">
        <section id="main">
          <h3>Main</h3>
          <h2>Content for Track 2</h2>
        </section>
      </div>
    );
  }
}

export default hot(module)(TrackTwo);
