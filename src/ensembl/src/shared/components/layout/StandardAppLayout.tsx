import React, { ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { BreakpointWidth } from 'src/global/globalConfig';
import usePrevious from 'src/shared/hooks/usePrevious';

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

  const mainClassNames = classNames(
    styles.main,
    { [styles.mainDefault]: props.isSidebarOpen },
    { [styles.mainFullWidth]: !props.isSidebarOpen }
  );

  const shouldShowSidebarNavigation =
    props.viewportWidth > BreakpointWidth.LAPTOP || props.isSidebarOpen;

  const topbarClassnames = classNames(
    styles.topbar,
    { [styles.topbar_withSidebarNavigation]: shouldShowSidebarNavigation },
    { [styles.topbar_withoutSidebarNavigation]: !shouldShowSidebarNavigation }
  );

  const sidebarWrapperClassnames = useSidebarWrapperClassNames(props);

  return (
    <div className={styles.standardAppLayout}>
      <div className={topbarClassnames}>
        {props.topbarContent}
        {shouldShowSidebarNavigation && props.sidebarNavigation}
      </div>
      <div className={styles.mainWrapper}>
        <div className={mainClassNames}>{props.mainContent}</div>
        <div className={sidebarWrapperClassnames}>
          {props.isDrawerOpen && <DrawerWindow onClick={props.onDrawerClose} />}
          <div className={styles.sidebarToolstrip}>
            <SidebarModeToggle
              onClick={
                props.isDrawerOpen
                  ? () => props.onDrawerClose()
                  : () => props.onSidebarToggle()
              }
              showAction={
                props.isSidebarOpen
                  ? SidebarModeToggleAction.CLOSE
                  : SidebarModeToggleAction.OPEN
              }
            />
            <div className={styles.sidebarToolstripContent}>
              {props.sidebarToolstripContent}
            </div>
          </div>
          <div className={styles.sidebar}>{props.sidebarContent}</div>
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

const useSidebarWrapperClassNames = (props: StandardAppLayoutProps) => {
  const previousSidebarOpen = usePrevious(props.isSidebarOpen);
  // do not use transition for opening and closing of the sidebar
  const isInstantaneous =
    !props.isSidebarOpen || // <-- sidebar about to close
    (props.isSidebarOpen && !previousSidebarOpen); // <-- sidebar about to open

  return classNames(
    styles.sidebarWrapper,
    { [styles.sidebarWrapperOpen]: props.isSidebarOpen },
    { [styles.sidebarWrapperClosed]: !props.isSidebarOpen },
    {
      [styles.sidebarWrapperDrawerOpen]: props.isDrawerOpen ?? false
    },
    { [styles.instantaneous]: isInstantaneous }
  );
};

export default StandardAppLayout;
