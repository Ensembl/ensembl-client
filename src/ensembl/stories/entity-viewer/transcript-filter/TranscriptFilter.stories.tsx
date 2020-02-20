import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import EntityViewerTranscriptFilter, {
  OptionsGroup
} from 'src/content/app/entity-viewer/components/transcript-filter/EntityViewerTranscriptFilter';

import styles from './TranscriptFilter.stories.scss';

const options: OptionsGroup[] = [
  [
    {
      value: 'Option 1',
      label: 'Option 1'
    },
    {
      value: 'Option 2',
      label: 'Option 2'
    },
    {
      value: 'Option 3',
      label: 'Option 3'
    }
  ],
  [
    {
      value: 'Option 4',
      label: 'Option 4'
    },
    {
      value: 'Option 5',
      label: 'Option 5'
    },
    {
      value: 'Option 6',
      label: 'Option 6'
    }
  ],
  [
    {
      value: 'Option 7',
      label: 'Option 7'
    },
    {
      value: 'Option 8',
      label: 'Option 8'
    },
    {
      value: 'Option 9',
      label: 'Option 9'
    }
  ]
];

const selectedValues = ['Option 1', 'Option 5', 'Option 8'];

const Wrapper = (props: any) => {
  const [values, setValues] = useState(selectedValues);

  const onChange = (values: string[]) => {
    setValues(values);
    action('entity-viewer-filters-changed')(values);
  };

  return (
    <div className={styles.defaultWrapper}>
      {
        <EntityViewerTranscriptFilter
          options={options}
          onChange={onChange}
          selectedValues={values}
          {...props}
        />
      }
    </div>
  );
};

storiesOf('Components|EntityViewer/Transcript Filter', module)
  .add('default', () => {
    return <Wrapper />;
  })
  .add('hide-unchecked', () => {
    return <Wrapper hideUnchecked />;
  });
