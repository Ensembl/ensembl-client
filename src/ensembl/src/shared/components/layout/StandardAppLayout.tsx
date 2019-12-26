import React, { ReactNode } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

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

type SidebarNavigationProps = {
  links: Array<{
    label: string;
    isActive: boolean;
  }>;
  onChange: (index: number) => void;
};

type StandardAppLayoutProps = {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
  sidebarToolstripContent?: ReactNode;
  sidebarNavigation: SidebarNavigationProps;
  topbarContent: ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  isDrawerOpen: boolean;
  drawerContent?: ReactNode;
  onDrawerClose: () => void;
};

const StandardAppLayout = (props: StandardAppLayoutProps) => {
  const mainClassnames = classNames(
    styles.main,
    { [styles.mainDefault]: props.isSidebarOpen },
    { [styles.mainFullWidth]: !props.isSidebarOpen }
  );

  const sidebarWrapperClassnames = classNames(
    styles.sideBarWrapper,
    { [styles.sideBarWrapperOpen]: props.isSidebarOpen },
    { [styles.sideBarWrapperClosed]: !props.isSidebarOpen },
    {
      [styles.sideBarWrapperDrawerOpen]: props.isDrawerOpen ?? false
    }
  );

  // <SidebarTabs {...props} />

  return (
    <div className={styles.standardAppLayout}>
      <div className={styles.topBar}>
        {props.topbarContent}
        {props.sidebarNavigation}
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

const SidebarTabs = (props: StandardAppLayoutProps) => {
  const links = props.sidebarNavigation.links.map((link, index) => {
    const isLinkActive = shouldLinkBeActive(
      link,
      props.isSidebarOpen,
      props.isDrawerOpen
    );
    return (
      <span
        key={index}
        className={classNames(styles.sidebarTab, {
          [styles.sidebarTabActive]: isLinkActive
        })}
        {...(!isLinkActive
          ? { onClick: () => props.sidebarNavigation.onChange(index) }
          : null)}
      >
        {link.label}
      </span>
    );
  });

  return <div className={styles.sidebarTabs}>{links}</div>;
};

const shouldLinkBeActive = (
  link: { isActive: boolean },
  isSidebarOpen: boolean,
  isDrawerOpen: boolean
) => link.isActive && isSidebarOpen && !isDrawerOpen;

// left-most transparent part of the drawer allowing the user to see what element is behind the drawer;
// when clicked, will close the drawer
const DrawerWindow = (props: { onClick: () => void }) => {
  return <div className={styles.drawerWindow} onClick={props.onClick} />;
};

export default StandardAppLayout;
