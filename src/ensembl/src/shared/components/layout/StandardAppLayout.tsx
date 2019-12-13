import React, { useState, ReactNode } from 'react';
import classNames from 'classnames';

import { ReactComponent as Chevron } from 'static/img/shared/chevron-right.svg';

import styles from './StandardAppLayout.scss';

enum SidebarModeToggleAction {
  OPEN = 'open',
  CLOSE = 'close'
}

type SidebarModeToggleProps = {
  onClick: () => void;
  showAction: SidebarModeToggleAction;
};

type StandardAppLayoutProps = {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
  topbarContent: ReactNode;
};

const StandardAppLayout = (props: StandardAppLayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarWrapperClassnames = classNames(
    styles.sideBarWrapper,
    { [styles.sideBarWrapperOpen]: isOpen },
    { [styles.sideBarWrapperClosed]: !isOpen }
  );

  return (
    <div className={styles.standardAppLayout}>
      <div className={styles.topBar}>{props.topbarContent}</div>
      <div className={styles.mainWrapper}>
        <div className={styles.main}>{props.mainContent}</div>
        <div className={sidebarWrapperClassnames}>
          <div className={styles.sideBarToolstrip}>
            <SidebarModeToggle
              onClick={toggleSidebar}
              showAction={
                isOpen
                  ? SidebarModeToggleAction.CLOSE
                  : SidebarModeToggleAction.OPEN
              }
            />
          </div>
          <div className={styles.sideBar}>{props.sidebarContent}</div>
        </div>
      </div>
    </div>
  );
};

const SidebarModeToggle = (props: SidebarModeToggleProps) => {
  const chevronClasses = classNames(styles.sidebarModeToggleChevron, {
    [styles.sidebarModeToggleChevronOpen]:
      props.showAction === SidebarModeToggleAction.OPEN
  });

  return (
    <div className={styles.sidebarModeToggle}>
      <Chevron className={chevronClasses} onClick={props.onClick} />
    </div>
  );
};

export default StandardAppLayout;
