import React, { Component } from 'react';

import DrawerBar from './DrawerBar';

type TrackProps = {
  currentTrack: string
};

type TrackState = {};

class Track extends Component<TrackProps, TrackState> {
  public render() {
    return (
      <section className="drawer">
        <DrawerBar currentTrack={this.props.currentTrack} />
        <div className="track-canvas">
          {this.props.children}
        </div>
      </section>
    );
  }
}

export default Track;
