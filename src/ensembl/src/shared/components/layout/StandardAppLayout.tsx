import React, { useState } from 'react';
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

const StandardAppLayout = () => {
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
      <div className={styles.topBar}>I am top bar</div>
      <div className={styles.mainWrapper}>
        <div className={styles.main}>This is main</div>
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
          <div className={styles.sideBar}>I am sidebar</div>
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
