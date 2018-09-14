import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { HashLink } from 'react-router-hash-link';

import { DrawerSection } from '../../configs/drawerSectionConfig';

import closeIcon from 'assets/img/track-panel/close.svg';

type DrawerBarParams = {};

type DrawerBarProps = RouteComponentProps<DrawerBarParams> & {
  closeDrawer: () => void;
  currentTrack: string;
  drawerSections: DrawerSection[];
};

class DrawerBar extends Component<DrawerBarProps> {
  public drawerSections: DrawerSection[] = [];

  public render() {
    return (
      <div className="drawer-bar">
        <dl className="page-list">
          <dt><HashLink smooth={true} to={`${this.props.location.pathname}#main`}>Main</HashLink></dt>
          {this.props.drawerSections &&
            this.props.drawerSections.map((page: DrawerSection) => (
              <dt key={page.name}>
                <HashLink smooth={true} to={`${this.props.location.pathname}#${page.name}`}>{page.label}</HashLink>
              </dt>
            ))}
        </dl>
        <button className="close" onClick={this.props.closeDrawer}>
          <img src={closeIcon} alt="close drawer" />
        </button>
      </div>
    );
  }
}

export default withRouter((props: DrawerBarProps) => <DrawerBar {...props} />);
