import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import CheckBoxGrid, {
  filterCheckedAttributes
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import { Input } from 'src/shared';

import styles from './Styles.scss';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps;

const Orthologues = (props: Props) => {
  return (
    <>
      <Input value={'value'} onChange={console.log} placeholder={'Species'} />
    </>
  );
};

export default Orthologues;
