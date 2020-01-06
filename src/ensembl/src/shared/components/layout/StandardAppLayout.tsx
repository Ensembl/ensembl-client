import React, { ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { BreakpointWidth } from 'src/global/globalConfig';

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

type StandardAppLayoutProps = {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
  sidebarToolstripContent?: ReactNode;
  sidebarNavigation: ReactNode;
  topbarContent: ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  isDrawerOpen: boolean;
  drawerContent?: ReactNode;
  onDrawerClose: () => void;
  viewportWidth: BreakpointWidth;
};

const StandardAppLayout = (props: StandardAppLayoutProps) => {
  // TODO: is there any way to run this smarter?
  // Ideally, it should run only once per app life cycle to check whether user is on small screen and close the sidebar if they are
  useEffect(() => {
    if (props.viewportWidth < BreakpointWidth.DESKTOP && props.isSidebarOpen) {
      props.onSidebarToggle();
    }
  }, []);

  const mainClassnames = classNames(
    styles.main,
    { [styles.mainDefault]: props.isSidebarOpen },
    { [styles.mainFullWidth]: !props.isSidebarOpen }
  );

  const shouldShowSidebarNavigation =
    props.viewportWidth > BreakpointWidth.LAPTOP || props.isSidebarOpen;

  const topBarClassnames = classNames(
    styles.topBar,
    { [styles.topBar_withSidebarNavigation]: shouldShowSidebarNavigation },
    { [styles.topBar_withoutSidebarNavigation]: !shouldShowSidebarNavigation }
  );

  const sidebarWrapperClassnames = classNames(
    styles.sideBarWrapper,
    { [styles.sideBarWrapperOpen]: props.isSidebarOpen },
    { [styles.sideBarWrapperClosed]: !props.isSidebarOpen },
    {
      [styles.sideBarWrapperDrawerOpen]: props.isDrawerOpen ?? false
    }
  );

  return (
    <div className={styles.standardAppLayout}>
      <div className={topBarClassnames}>
        {props.topbarContent}
        {shouldShowSidebarNavigation && props.sidebarNavigation}
      </div>
      <div className={styles.mainWrapper}>
        <div className={mainClassnames}>{props.mainContent}</div>
        <div className={sidebarWrapperClassnames}>
          {props.isDrawerOpen && <DrawerWindow onClick={props.onDrawerClose} />}
          <div className={styles.sideBarToolstrip}>
            <SidebarModeToggle
              onClick={
                props.isDrawerOpen ? props.onDrawerClose : props.onSidebarToggle
              }
              showAction={
                props.isSidebarOpen
                  ? SidebarModeToggleAction.CLOSE
                  : SidebarModeToggleAction.OPEN
              }
            />
            <div className={styles.sideBarToolstripContent}>
              {props.sidebarToolstripContent}
            </div>
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

StandardAppLayout.defaultProps = {
  isDrawerOpen: false,
  onDrawerClose: noop
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

// left-most transparent part of the drawer allowing the user to see what element is behind the drawer;
// when clicked, will close the drawer
const DrawerWindow = (props: { onClick: () => void }) => {
  return <div className={styles.drawerWindow} onClick={props.onClick} />;
};

export default StandardAppLayout;
