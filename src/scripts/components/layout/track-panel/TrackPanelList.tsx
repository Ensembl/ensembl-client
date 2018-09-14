import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { UnregisterCallback, Location } from 'history';

import TrackPanelListItem from './TrackPanelListItem';
import {
  TrackPanelConfig,
  trackPanelConfig
} from '../../../configs/trackPanelConfig';

type TrackPanelListParams = {};

type TrackPanelListProps = RouteComponentProps<TrackPanelListParams> & {
  currentTrack: string;
  openDrawer: () => void;
  updateTrack: (currentTrack: string) => void;
};

class TrackPanelList extends Component<TrackPanelListProps> {
  constructor(props: TrackPanelListProps) {
    super(props);

    this.changeTrack = this.changeTrack.bind(this);
  }

  public componentDidMount() {
    this.highlightCurrentTrack(this.props.location);

    this.historyUnlistener = this.props.history.listen((location: Location) => {
      this.highlightCurrentTrack(location);
    });
  }

  public componentWillUnmount() {
    this.historyUnlistener();
  }

  public changeTrack(currentTrack: string) {
    const { history, match, openDrawer, updateTrack } = this.props;

    history.push(`${match.path}/track/${currentTrack}`);

    updateTrack(currentTrack);
    openDrawer();
  }

  public render() {
    return (
      <div className="track-panel-list">
        <dl>
          {trackPanelConfig.map((track: TrackPanelConfig) => (
            <TrackPanelListItem
              key={track.id}
              className={this.getTrackClass(track.name)}
              track={track}
              changeTrack={this.changeTrack}
            />
          ))}
        </dl>
      </div>
    );
  }

  private historyUnlistener: UnregisterCallback = () => null;

  private getTrackClass(trackName: string): string {
    if (this.props.currentTrack === trackName) {
      return 'current-track';
    } else {
      return '';
    }
  }

  private highlightCurrentTrack(location: Location) {
    if (location.pathname.indexOf('/track') === -1) {
      return;
    }

    const currentTrack = location.pathname.replace(`${this.props.match.path}/track/`, '');

    // changing the current track state should highlight the current track
    this.props.updateTrack(currentTrack);
  }
}

export default withRouter((props: TrackPanelListProps) => (
  <TrackPanelList {...props} />
));
