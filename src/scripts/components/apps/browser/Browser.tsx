import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import BrowserBar from './BrowserBar';
import TrackPanel from '../../layout/track-panel/TrackPanel';
import Track from '../../tracks/Track';
import { RootState } from '../../../reducers';
import { BrowserOpenState } from '../../../reducers/browserReducer';
import { closeDrawer } from '../../../actions/browserActions';

type BrowserProps = RouteComponentProps<{}> & {
  browserOpenState: BrowserOpenState;
  closeDrawer: () => void;
  drawerOpened: boolean;
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
      <Fragment>
        <section className={`browser ${this.props.browserOpenState}`}>
          <BrowserBar expanded={false} drawerOpened={this.props.drawerOpened} />
          <div className="browser-canvas-wrapper" onClick={this.closeTrack}>
            <div className="browser-canvas">
              <h2>Species Browser Placeholder</h2>
            </div>
          </div>
        </section>
        <TrackPanel />
        {this.props.drawerOpened && <Track />}
      </Fragment>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const { browserOpenState, drawerOpened } = state.browser;
  return { browserOpenState, drawerOpened };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeDrawer: () => dispatch(closeDrawer())
});

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Browser)
);
