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

import 'assets/browser/browser';

type BrowserProps = RouteComponentProps<{}> & {
  browserOpenState: BrowserOpenState;
  closeDrawer: () => void;
  drawerOpened: boolean;
};

class Browser extends Component<BrowserProps> {
  private browserCanvas: React.RefObject<HTMLDivElement>;

  constructor(props: BrowserProps) {
    super(props);

    this.browserCanvas = React.createRef();
    this.closeTrack = this.closeTrack.bind(this);
  }

  public componentDidMount() {
    const moveEvent = new CustomEvent('bpane-start', {
      bubbles: true,
      detail: {}
    });

    const currentEl = this.browserCanvas.current;

    if (currentEl && currentEl.ownerDocument) {
      const browserEl = currentEl.ownerDocument.querySelector(
        'body'
      ) as HTMLBodyElement;

      if (browserEl) {
        browserEl.dispatchEvent(moveEvent);
      }
    }
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
            <div className="browser-canvas" ref={this.browserCanvas}>
              <div id="stage" />
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
