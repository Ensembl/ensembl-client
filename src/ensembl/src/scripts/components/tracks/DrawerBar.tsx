import React, { Component, ReactEventHandler } from 'react';

import { DrawerSection } from '../../configs/drawerSectionConfig';
import { EventHandlers } from '../../types/objects';

import closeIcon from 'assets/img/track-panel/close.svg';

type DrawerBarProps = {
  changeCurrentDrawerSection: (currentDrawerSection: string) => void;
  closeDrawer: () => void;
  currentTrack: string;
  drawerSections: DrawerSection[];
};

class DrawerBar extends Component<DrawerBarProps> {
  public drawerSections: DrawerSection[] = [];
  public clickHandlers: EventHandlers = {};

  public render() {
    return (
      <div className="drawer-bar">
        <dl className="page-list">
          <dt>
            <button onClick={this.getClickHandler('main')}>{'Main'}</button>
          </dt>
          {this.props.drawerSections &&
            this.props.drawerSections.map((section: DrawerSection) => (
              <dt key={section.name}>
                <button onClick={this.getClickHandler(section.name)}>
                  {section.label}
                </button>
              </dt>
            ))}
        </dl>
        <button className="close" onClick={this.props.closeDrawer}>
          <img src={closeIcon} alt="close drawer" />
        </button>
      </div>
    );
  }

  private getClickHandler(key: string) {
    if (!this.clickHandlers.hasOwnProperty(key)) {
      const handler: ReactEventHandler = () => {
        this.props.changeCurrentDrawerSection(key);
      };

      this.clickHandlers[key] = handler;
    }

    return this.clickHandlers[key];
  }
}

export default DrawerBar;
