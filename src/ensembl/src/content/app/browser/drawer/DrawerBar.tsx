import React, { FunctionComponent, ReactEventHandler } from 'react';

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

const DrawerBar: FunctionComponent<DrawerBarProps> = (
  props: DrawerBarProps
) => {
  const clickHandlers: EventHandlers = {};

  const getClickHandler = (key: string) => {
    if (!clickHandlers.hasOwnProperty(key)) {
      const handler: ReactEventHandler = () => {
        props.changeCurrentDrawerSection(key);
      };

      clickHandlers[key] = handler;
    }

    return clickHandlers[key];
  };

  return (
    <div className={styles.drawerBar}>
      <dl className={styles.pageList}>
        <dt>
          <button onClick={getClickHandler('main')}>{'Main'}</button>
        </dt>
        {props.drawerSections &&
          props.drawerSections.map((section: DrawerSection) => (
            <dt key={section.name}>
              <button onClick={getClickHandler(section.name)}>
                {section.label}
              </button>
            </dt>
          ))}
      </dl>
      <button className={styles.closeButton} onClick={props.closeDrawer}>
        <img src={closeIcon} alt="close drawer" />
      </button>
    </div>
  );
};

export default DrawerBar;
