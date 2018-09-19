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
  currentTrack: string;
  closeDrawer: () => void;
  drawerOpened: boolean;
};

class Browser extends Component<BrowserProps> {
  constructor(props: BrowserProps) {
    super(props);

    this.closeTrack = this.closeTrack.bind(this);
  }

  public componentDidMount() {
    const { currentTrack, drawerOpened, history, match } = this.props;

    if (drawerOpened === true) {
      history.push(`${match.path}/track/${currentTrack}`);
    }
  }

  public componentDidUpdate(prevProps: BrowserProps) {
    if (
      this.props.drawerOpened !== prevProps.drawerOpened &&
      this.props.drawerOpened === false
    ) {
      this.redirectToBrowser();
    }
  }

  public closeTrack() {
    if (this.props.drawerOpened === false) {
      return;
    }

    this.props.closeDrawer();
    this.redirectToBrowser();
  }

  public redirectToBrowser() {
    if (this.props.history.location.pathname.indexOf('/track') === -1) {
      return;
    }

    this.props.history.push(this.props.match.path);
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
  const { currentTrack, browserOpenState, drawerOpened } = state.browser;
  return { currentTrack, browserOpenState, drawerOpened };
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
