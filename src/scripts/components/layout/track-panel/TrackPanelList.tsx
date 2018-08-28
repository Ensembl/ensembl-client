import React, { Component, MouseEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { UnregisterCallback, Location } from 'history';

const ellipsisIcon = require('assets/img/track-panel/ellipsis-h-solid.svg');
const eyeIcon = require('assets/img/track-panel/eye-solid.svg');

type TrackPanelListParams = {};

type TrackPanelListProps = RouteComponentProps<TrackPanelListParams> & {
  updateCurrentTrackName: (currentTrack: string) => void
};

type TrackPanelListState = {
  currentTrack: string
};

type TrackPanelConfig = {
  name: string,
  label: string
};

const trackPanelConfig: TrackPanelConfig[] = [
  {
    name: 'track-one',
    label: 'Track 1',
  },
  {
    name: 'track-two',
    label: 'Track 2'
  }
];

class TrackPanelList extends Component<TrackPanelListProps, TrackPanelListState> {
  historyUnlistener: UnregisterCallback = () => null;

  readonly state: TrackPanelListState = {
    currentTrack: ''
  };

  constructor(props: TrackPanelListProps) {
    super(props);

    this.changeTrack = this.changeTrack.bind(this);
  }

  componentDidMount() {
    this.highlightCurrentTrack(this.props.location);

    this.historyUnlistener = this.props.history.listen((location: Location) => {
      this.highlightCurrentTrack(location);
    });
  }

  componentWillUnmount() {
    this.historyUnlistener();
  }

  changeTrack(track: string) {
    const { path } = this.props.match;

    this.props.history.push(`${path}/track/${track}`);

    this.props.updateCurrentTrackName(track);
  }

  highlightCurrentTrack(location: Location) {
    const { match } = this.props;
    const currentTrack = location.pathname.replace(`${match.path}/track/`, '');

    // changing the current track state should highlight the current track
    this.setState({ currentTrack });
  }

  render() {
    return (
      <div className="track-panel-list">
        <dl>
          {
            trackPanelConfig.map((track: TrackPanelConfig, index: number) => (
              <dt key={`${track.name}--${index}`} className={(this.state.currentTrack.indexOf(track.name) > -1) ? 'current-track' : ''}>
                <label>{track.label}</label>
                <button onClick={() => this.changeTrack(track.name)}>
                  <img src={ellipsisIcon} alt={`Go to ${track.label}`} />
                </button>
                <button>
                  <img src={eyeIcon} alt="" />
                </button>
              </dt>
            ))
          }
        </dl>
      </div>
    );
  }
}

export default withRouter((props: TrackPanelListProps) => <TrackPanelList {...props} />);
