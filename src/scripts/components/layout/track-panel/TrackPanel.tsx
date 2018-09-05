import React, { Component } from 'react';

import TrackPanelBar from './TrackPanelBar';
import TrackPanelList from './TrackPanelList';

type TrackPanelProps = {
  drawerOpened: boolean;
  closeDrawer: () => void;
  toggleBrowser: () => void;
  updateCurrentTrackName: (currentTrack: string) => void;
};

type TrackPanelState = {
  expanded: boolean;
};

class TrackPanel extends Component<TrackPanelProps, TrackPanelState> {
  public readonly state: TrackPanelState = {
    expanded: true
  };

  constructor(props: TrackPanelProps) {
    super(props);

    this.toggleTrackPanel = this.toggleTrackPanel.bind(this);
  }

  public toggleTrackPanel() {
    if (this.props.drawerOpened === true) {
      this.props.closeDrawer();

      return;
    }

    const expanded: boolean = !this.state.expanded;

    this.setState({ expanded });

    this.props.toggleBrowser();
  }

  public render() {
    const { expanded } = this.state;

    return (
      <section
        className={`track-panel react-slide-drawer ${
          expanded ? 'expanded' : 'collapsed'
        }`}
      >
        <TrackPanelBar
          expanded={expanded}
          toggleTrackPanel={this.toggleTrackPanel}
        />
        {expanded ? (
          <TrackPanelList
            updateCurrentTrackName={this.props.updateCurrentTrackName}
          />
        ) : null}
      </section>
    );
  }
}

export default TrackPanel;
