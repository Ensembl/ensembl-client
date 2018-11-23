import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import BrowserHeaderBar from './BrowserHeaderBar';
import BrowserImage from './BrowserImage';
import BrowserInfoBar from './BrowserInfoBar';
import BrowserNavBar from './BrowserNavBar';
import TrackPanel from '../../layout/track-panel/TrackPanel';
import Track from '../../tracks/Track';

import { RootState } from '../../../reducers';
import { BrowserOpenState } from '../../../reducers/browserReducer';
import { closeDrawer, toggleBrowserNav } from '../../../actions/browserActions';
import {
  getBrowserOpenState,
  getDrawerOpened,
  getBrowserNavOpened
} from '../../../selectors/browserSelectors';

import 'assets/browser/browser';

type BrowserProps = RouteComponentProps<{}> & {
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  closeDrawer: () => void;
  drawerOpened: boolean;
  toggleBrowserNav: () => void;
};

class Browser extends Component<BrowserProps> {
  constructor(props: BrowserProps) {
    super(props);

    this.closeTrack = this.closeTrack.bind(this);
  }

  public closeTrack() {
    if (this.props.drawerOpened === false) {
      return;
    }

    this.props.closeDrawer();
  }

  public render() {
    return (
      <section className="browser">
        <BrowserHeaderBar />
        <div className="browser-inner-wrapper">
          <div
            className={`browser-image-wrapper ${this.props.browserOpenState}`}
            onClick={this.closeTrack}
          >
            <BrowserInfoBar
              browserNavOpened={this.props.browserNavOpened}
              expanded={true}
              toggleBrowserNav={this.props.toggleBrowserNav}
            />
            {this.props.browserNavOpened && <BrowserNavBar />}
            <BrowserImage />
          </div>
          <TrackPanel />
          {this.props.drawerOpened && <Track />}
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  browserNavOpened: getBrowserNavOpened(state),
  browserOpenState: getBrowserOpenState(state),
  drawerOpened: getDrawerOpened(state)
});

const mapDispatchToProps = {
  closeDrawer,
  toggleBrowserNav
};

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
