import React from 'react';
import { storiesOf } from '@storybook/react';

import { StandardAppLayout } from 'src/shared/components/layout';

import styles from './Layout.stories.scss';

const TopBarContent = () => (
  <div className={styles.topBarContent}>This is top bar content</div>
);

// https://user-images.githubusercontent.com/6834224/70806519-6fc8bf00-1db3-11ea-8ecd-238b410230af.png
const MainContent = () => (
  <div className={styles.mainContent}>
    <img src="https://user-images.githubusercontent.com/6834224/70806519-6fc8bf00-1db3-11ea-8ecd-238b410230af.png" />
  </div>
);

const SidebarContentSimple = () => <div>This is sidebar content</div>;

storiesOf('Components|Shared Components/Layout/StandardAppLayout', module).add(
  'default',
  () => {
    return (
      <div className={styles.wrapper}>
        <StandardAppLayout
          mainContent={<MainContent />}
          topbarContent={<TopBarContent />}
          sidebarContent={<SidebarContentSimple />}
        />
      </div>
    );
  }
);
