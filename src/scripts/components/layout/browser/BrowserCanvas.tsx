import React, { Component, Fragment, ReactNode } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { UnregisterCallback, Location } from 'history';

import BrowserBar from './BrowserBar';
import TrackPanel from '../track-panel/TrackPanel';
import Track from '../../tracks/Track';

type BrowserCanvasParams = {};

type BrowserCanvasProps = RouteComponentProps<BrowserCanvasParams> & {
  trackRoutes: ReactNode;
};

type BrowserCanvasState = {
  browserExpanded: boolean;
  currentTrack: string;
  drawerOpened: boolean;
};

class BrowserCanvas extends Component<BrowserCanvasProps, BrowserCanvasState> {
  public readonly state: BrowserCanvasState = {
    browserExpanded: false,
    currentTrack: '',
    drawerOpened: false
  };

  public constructor(props: BrowserCanvasProps) {
    super(props);

    this.toggleBrowser = this.toggleBrowser.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.updateCurrentTrackName = this.updateCurrentTrackName.bind(this);
  }

  public componentDidMount() {
    this.toggleDrawer();

    this.historyUnlistener = this.props.history.listen((location: Location) => {
      this.toggleDrawer(location);
    });
  }

  public componentWillUnmount() {
    this.historyUnlistener();
  }

  public toggleBrowser() {
    const browserExpanded = !this.state.browserExpanded;

    this.setState({ browserExpanded });
  }

  public closeDrawer() {
    if (this.state.drawerOpened === false) {
      return;
    }

    const { history, match } = this.props;

    history.push(`${match.path}`);
  }

  public updateCurrentTrackName(currentTrack: string) {
    this.setState({ currentTrack });
  }

  public render() {
    const { browserExpanded, drawerOpened } = this.state;

    let className: string = 'browser ';

    if (drawerOpened === true) {
      className += 'collapsed';
    } else if (browserExpanded === true) {
      className += 'expanded';
    } else {
      className += 'semi-expanded';
    }

    return (
      <Fragment>
        <section className={className}>
          <BrowserBar expanded={false} drawerOpened={drawerOpened} />
          <div className="browser-canvas-wrapper" onClick={this.closeDrawer}>
            <div className="browser-canvas">{this.props.children}</div>
          </div>
        </section>
        <TrackPanel
          drawerOpened={drawerOpened}
          closeDrawer={this.closeDrawer}
          toggleBrowser={this.toggleBrowser}
          updateCurrentTrackName={this.updateCurrentTrackName}
        />
        {drawerOpened && (
          <Track currentTrack={this.state.currentTrack}>
            {this.props.trackRoutes}
          </Track>
        )}
      </Fragment>
    );
  }

  private toggleDrawer(location?: Location) {
    let drawerOpened: boolean = true;

    location = location || this.props.location;

    if (location.pathname === this.props.match.path) {
      drawerOpened = false;
    }

    this.setState({ drawerOpened });
  }

  private historyUnlistener: UnregisterCallback = () => null;
}

export default withRouter((props: BrowserCanvasProps) => (
  <BrowserCanvas {...props} />
));
