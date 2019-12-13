import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { ReactComponent as Chevron } from 'static/img/shared/chevron-right.svg';
import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';

import styles from './StandardAppLayout.scss';

enum SidebarModeToggleAction {
  OPEN = 'open',
  CLOSE = 'close'
}

type SidebarModeToggleProps = {
  onClick: () => void;
  showAction: SidebarModeToggleAction;
};

type StandardAppLayoutWithoutDrawerProps = {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
  topbarContent: ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
};

type StandardAppLayoutWithDrawerProps = StandardAppLayoutWithoutDrawerProps & {
  isDrawerOpen: boolean;
  drawerContent: ReactNode;
  onDrawerClose: () => void;
};

type StandardAppLayoutProps =
  | StandardAppLayoutWithoutDrawerProps
  | StandardAppLayoutWithDrawerProps;

const StandardAppLayout = (props: StandardAppLayoutProps) => {
  const mainContainerClassnames = classNames(
    styles.mainWrapper,
    { [styles.mainWrapperDefault]: props.isSidebarOpen },
    { [styles.mainWrapperFullWidth]: !props.isSidebarOpen }
  );

  const sidebarWrapperClassnames = classNames(
    styles.sideBarWrapper,
    { [styles.sideBarWrapperOpen]: props.isSidebarOpen },
    { [styles.sideBarWrapperClosed]: !props.isSidebarOpen },
    { [styles.sideBarWrapperDrawerOpen]: props.isDrawerOpen || false }
  );

  return (
    <div className={styles.standardAppLayout}>
      <div className={styles.topBar}>{props.topbarContent}</div>
      <div className={mainContainerClassnames}>
        <div className={styles.main}>{props.mainContent}</div>
        <div className={sidebarWrapperClassnames}>
          <div className={styles.sideBarToolstrip}>
            <SidebarModeToggle
              onClick={props.onSidebarToggle}
              showAction={
                props.isSidebarOpen
                  ? SidebarModeToggleAction.CLOSE
                  : SidebarModeToggleAction.OPEN
              }
            />
          </div>
          <div className={styles.sideBar}>{props.sidebarContent}</div>
          <div className={styles.drawer}>
            <CloseIcon
              className={styles.drawerClose}
              onClick={props.onDrawerClose}
            />
            {props.drawerContent || null}
          </div>
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
