import React, { Component, ReactEventHandler } from 'react';

import { DrawerSection } from './drawerSectionConfig';
import { EventHandlers } from 'src/objects';

import closeIcon from 'static/img/track-panel/close.svg';

import styles from './DrawerBar.scss';

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
      <div className={styles.drawerBar}>
        <dl className={styles.pageList}>
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
        <button className={styles.closeButton} onClick={this.props.closeDrawer}>
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
