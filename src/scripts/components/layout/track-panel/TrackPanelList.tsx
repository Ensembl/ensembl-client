import React, { Component, MouseEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { UnregisterCallback, Location } from 'history';

import TrackPanelListItem from './TrackPanelListItem';
import { TrackPanelConfig, trackPanelConfig } from '../../../configs/trackPanelConfig';

type TrackPanelListParams = {};

type TrackPanelListProps = RouteComponentProps<TrackPanelListParams> & {
  updateCurrentTrackName: (currentTrack: string) => void
};

type TrackPanelListState = {
  currentTrack: string
};

class TrackPanelList extends Component<TrackPanelListProps, TrackPanelListState> {
  public readonly state: TrackPanelListState = {
    currentTrack: ''
  };

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

  public changeTrack(track: string) {
    const { path } = this.props.match;

    this.props.history.push(`${path}/track/${track}`);

    this.props.updateCurrentTrackName(track);
  }

  public render() {
    return (
      <div className="track-panel-list">
        <dl>
          {
            trackPanelConfig.map((track: TrackPanelConfig, index: number) =>
              <TrackPanelListItem key={track.id} className={this.getTrackClassName(track.name)} track={track} changeTrack={this.changeTrack} />)
          }
        </dl>
      </div>
    );
  }

  private historyUnlistener: UnregisterCallback = () => null;

  private getTrackClassName(track: string) {
    const { currentTrack } = this.state;

    if (currentTrack.indexOf(track) > -1) {
      return 'current-track';
    } else {
      return '';
    }
  }

  private highlightCurrentTrack(location: Location) {
    const { match } = this.props;
    const currentTrack = location.pathname.replace(`${match.path}/track/`, '');

    // changing the current track state should highlight the current track
    this.setState({ currentTrack });
  }
}

export default withRouter((props: TrackPanelListProps) => <TrackPanelList {...props} />);
