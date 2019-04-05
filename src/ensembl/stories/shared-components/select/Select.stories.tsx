import React from 'react';
import { storiesOf } from '@storybook/react';
import times from 'lodash/times';
// import { action } from '@storybook/addon-actions';

import Select from 'src/shared/select/Select';

import styles from './Select.stories.scss';

const createSimpleOption = (number: number) => ({
  value: number,
  label: `option ${number}`,
  isSelected: false
});

const crreateSimpleOptions = (number: number) => {
  const options = times(number, (time) => createSimpleOption(time + 1));
  return {
    options
  };
};

// const Wrapper = (props: any) => {
//   const [value, setValue] = useState('');
//   const { searchField: SearchField, ...otherProps } = props;

//   return (
//     <div className={styles.searchFieldWrapper}>
//       <SearchField value={value} onChange={setValue} {...otherProps} />
//     </div>
//   );
// };

storiesOf('Components|Shared Components/Select', module).add('default', () => (
  <div className={styles.defaultWrapper}>
    <Select optionGroups={[crreateSimpleOptions(5)]} />
  </div>
));
