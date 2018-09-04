import React, { Component } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { TrackPage, trackPagesConfig } from '../../configs/trackPages';

import closeIcon from 'assets/img/track-panel/close.svg';

type DrawerBarParams = {};

type DrawerBarProps = RouteComponentProps<DrawerBarParams> & {
  currentTrack: string
};

type DrawerBarState = {
  currentPage: string
};

class DrawerBar extends Component<DrawerBarProps, DrawerBarState> {
  public readonly state: DrawerBarState = {
    currentPage: ''
  };

  public render() {
    const trackPages: TrackPage[] = trackPagesConfig[this.props.currentTrack];

    return (
      <div className="drawer-bar">
        <dl className="page-list">
          {
            trackPages &&
            trackPages.map((page: TrackPage, index: number) => (
              <dt key={`${page.name}--${index}`}>
                <button onClick={() => this.changePage(page.name)}>{page.label}</button>
              </dt>
            ))
          }
        </dl>
        <Link className="close" to="/app/speciesbrowser">
          <img src={closeIcon} alt="close drawer" />
        </Link>
      </div>
    );
  }

  private changePage(page: string) {
    this.setState({ currentPage: name });

    const { match, currentTrack } = this.props;

    this.props.history.push(`${match.path}/track/${currentTrack}/${page}`);
  }
}

export default withRouter((props: DrawerBarProps) => <DrawerBar {...props} />);
