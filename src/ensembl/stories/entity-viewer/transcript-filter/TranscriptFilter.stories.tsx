import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import times from 'lodash/times';
import faker from 'faker';

import EntityViewerTranscriptFilter from 'src/content/app/entity-viewer/components/transcript-filter/EntityViewerTranscriptFilter';

import styles from './TranscriptFilter.stories.scss';

const createOption = () => {
  return {
    value: faker.random.uuid(),
    label: faker.random.words()
  };
};

const createOptionGroup = () => {
  return times(5, () => createOption());
};

const optionGroups = times(3, () => createOptionGroup());

const getRandomSelectedValues = () => {
  const randomSelectedValues: string[] = [];

  optionGroups.forEach((options) =>
    randomSelectedValues.push(
      options[Math.floor(Math.random() * options.length)].value
    )
  );

  return randomSelectedValues;
};

const selectedValues = getRandomSelectedValues();

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
          options={optionGroups}
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
