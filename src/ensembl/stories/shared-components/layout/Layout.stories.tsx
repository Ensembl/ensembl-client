import React, { useState, ReactNode } from 'react';
import { storiesOf } from '@storybook/react';

import { BreakpointWidth } from 'src/global/globalConfig';

import { StandardAppLayout, DocLayout } from 'src/shared/components/layout';
import { SecondaryButton } from 'src/shared/components/button/Button';

import styles from './Layout.stories.scss';
import { SidebarBehaviourType } from 'src/shared/components/layout/StandardAppLayout';

const MainContent = () => (
  <div className={styles.mainContent}>
    <img src="https://user-images.githubusercontent.com/6834224/70806519-6fc8bf00-1db3-11ea-8ecd-238b410230af.png" />
  </div>
);

const SidebarContentSimple = () => (
  <div className={styles.sidebarContent}>This is sidebar content</div>
);

storiesOf('Components|Shared Components/Layout/DocLayout', module).add(
  'default',
  () => {
    return (
      <div className={styles.wrapper}>
        <DocLayout
          sidebarContent={<SidebarContentSimple />}
          mainContent={<MainContent />}
        />
      </div>
    );
  }
);

const TopbarContent = () => (
  <div className={styles.topbarContent}>This is top bar content</div>
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

const SidebarNavigation = () => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(0);

  return (
    <div className={styles.sidebarNavigation}>
      {['Link 1', 'Link 2'].map((linkStr, index) => (
        <span
          key={linkStr}
          className={activeLinkIndex === index ? styles.activeLink : ''}
          onClick={() => setActiveLinkIndex(index)}
        >
          {linkStr}
        </span>
      ))}
    </div>
  );
};

const DrawerContent = () => (
  <div className={styles.drawerContent}>This is drawer content</div>
);

const Wrapper = (props: {
  isSidebarOpen: boolean;
  isDrawerOpen?: boolean;
  sidebarContent: ReactNode;
  sidebarBehaviour?: SidebarBehaviourType;
  drawerContent?: ReactNode;
  onSidebarToggle: () => void;
  onDrawerClose?: () => void;
}) => {
  return (
    <div className={styles.wrapper}>
      <StandardAppLayout
        mainContent={<MainContent />}
        topbarContent={<TopbarContent />}
        sidebarNavigation={<SidebarNavigation />}
        sidebarToolstripContent={<SidebarToolstripContent />}
        viewportWidth={BreakpointWidth.BIG_DESKTOP}
        {...props}
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
  })
  .add('with slideover sidebar', () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    return (
      <Wrapper
        isSidebarOpen={isSidebarOpen}
        sidebarContent={<SidebarContentSimple />}
        sidebarBehaviour={SidebarBehaviourType.SLIDEOVER}
        onSidebarToggle={toggleSidebar}
      />
    );
  });
