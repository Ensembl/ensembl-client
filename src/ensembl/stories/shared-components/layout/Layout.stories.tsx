import React, { useState, ReactNode } from 'react';
import { storiesOf } from '@storybook/react';

import { BreakpointWidth } from 'src/global/globalConfig';

import { StandardAppLayout } from 'src/shared/components/layout';
import { SecondaryButton } from 'src/shared/components/button/Button';

import styles from './Layout.stories.scss';

const TopBarContent = () => (
  <div className={styles.topbarContent}>This is top bar content</div>
);

const MainContent = () => (
  <div className={styles.mainContent}>
    <img src="https://user-images.githubusercontent.com/6834224/70806519-6fc8bf00-1db3-11ea-8ecd-238b410230af.png" />
  </div>
);

const SidebarContentSimple = () => (
  <div className={styles.sidebarContent}>This is sidebar content</div>
);

const SidebarContentWithDrawerOpener = (props: {
  isDrawerOpen: boolean;
  openDrawer: () => void;
}) => {
  return (
    <div className={styles.sidebarContent}>
      This is sidebar with drawer opener
      <div>
        {props.isDrawerOpen ? (
          'You have opened the drawer'
        ) : (
          <SecondaryButton onClick={props.openDrawer}>
            Open drawer
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

const SidebarToolstripContent = () => (
  <div className={styles.sidebarToolstripContent}>Here be icons</div>
);

const DrawerContent = () => (
  <div className={styles.drawerContent}>This is drawer content</div>
);

const Wrapper = (props: {
  isSidebarOpen: boolean;
  isDrawerOpen?: boolean;
  sidebarContent: ReactNode;
  drawerContent?: ReactNode;
  onSidebarToggle: () => void;
  onDrawerClose?: () => void;
}) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(0);
  const sidebarNavigation = {
    links: [...Array(2)].map((_, index) => ({
      label: `Link ${index + 1}`,
      isActive: index === activeLinkIndex
    })),
    onChange: (index: number) => setActiveLinkIndex(index)
  };

  return (
    <div className={styles.wrapper}>
      <StandardAppLayout
        mainContent={<MainContent />}
        topbarContent={<TopBarContent />}
        sidebarContent={props.sidebarContent}
        sidebarNavigation={sidebarNavigation}
        sidebarToolstripContent={<SidebarToolstripContent />}
        drawerContent={props.drawerContent || null}
        isSidebarOpen={props.isSidebarOpen}
        isDrawerOpen={props.isDrawerOpen || false}
        onSidebarToggle={props.onSidebarToggle}
        onDrawerClose={props.onDrawerClose}
        viewportWidth={BreakpointWidth.BIG_DESKTOP}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/Layout/StandardAppLayout', module)
  .add('without drawer', () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    return (
      <Wrapper
        isSidebarOpen={isSidebarOpen}
        sidebarContent={<SidebarContentSimple />}
        onSidebarToggle={toggleSidebar}
      />
    );
  })
  .add('with drawer', () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleSidebar = () => {
      isDrawerOpen ? setIsDrawerOpen(false) : setIsSidebarOpen(!isSidebarOpen);
    };
    const openDrawer = () => {
      setIsDrawerOpen(true);
    };
    const closeDrawer = () => {
      setIsDrawerOpen(false);
    };

    return (
      <Wrapper
        isSidebarOpen={isSidebarOpen}
        sidebarContent={
          <SidebarContentWithDrawerOpener
            isDrawerOpen={isDrawerOpen}
            openDrawer={openDrawer}
          />
        }
        onSidebarToggle={toggleSidebar}
        isDrawerOpen={isDrawerOpen}
        drawerContent={<DrawerContent />}
        onDrawerClose={closeDrawer}
      />
    );
  });
