import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import faker from 'faker';

import Panel from 'src/shared/components/panel/Panel';
import Tabs, { Tab } from 'src/shared/components/tabs/Tabs';

import styles from './Panel.stories.scss';

const onClose = () => {
  action('panel-closed')();
};

const tabsData: Tab[] = [
  { title: 'Proteins' },
  { title: 'Variants' },
  { title: 'Phenotypes' },
  { title: 'Gene expression' },
  { title: 'Gene ontology', isDisabled: true },
  { title: 'Gene pathways' }
];

const tabClassNames = {
  selected: styles.selectedTab,
  default: styles.defaultTab
};
const tabs = (
  <Tabs
    tabs={tabsData}
    classNames={tabClassNames}
    selectedTab={'Proteins'}
    selectTab={(tab: string) => action('selected-tab')(tab)}
  ></Tabs>
);

storiesOf('Components|Shared Components/Panel', module)
  .add('default', () => (
    <div className={styles.fullPageWrapper}>
      <Panel header={'Default Panel'} onClose={onClose}>
        <div>Panel Content</div>
      </Panel>
    </div>
  ))
  .add('full-page', () => (
    <div className={styles.fullPageWrapper}>
      <Panel
        header={'Full Page Panel'}
        onClose={onClose}
        classNames={{
          panel: styles.fullPagePanel
        }}
      >
        <div>Panel Content</div>
      </Panel>
    </div>
  ))
  .add('with-tabs', () => {
    return (
      <div className={styles.fullPageWrapper}>
        <Panel
          header={tabs}
          onClose={onClose}
          classNames={{
            panel: styles.fullPagePanel
          }}
        >
          <div>Panel Content</div>
        </Panel>
      </div>
    );
  })
  .add('long-content', () => {
    return (
      <div className={styles.fullPageWrapper}>
        <Panel
          header={tabs}
          onClose={onClose}
          classNames={{
            panel: styles.fullPagePanel
          }}
        >
          <div>{faker.lorem.paragraphs(100)}</div>
        </Panel>
      </div>
    );
  });
