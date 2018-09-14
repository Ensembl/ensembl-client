import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class TrackOne extends Component {
  public render() {
    return (
      <div className="track-section-wrapper track-one">
        <section id="main">
          <h3>Main</h3>
          <h2>Content for Track 1</h2>
        </section>
        <section id="summary">
          <h3>Summary</h3>
        </section>
        <section id="miscellaneous">
          <h3>Miscellaneous</h3>
        </section>
      </div>
    );
  }
}

export default hot(module)(TrackOne);
