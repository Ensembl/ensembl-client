import React from 'react';
import { connect } from 'react-redux';
import styles from './Content.scss';
import { getSelectedTabButton } from '../../customDownloadSelectors';
import DataSelector from './data-selector/DataSelector';
import ResultFilter from './result-filter/ResultFilter';
import TabButtons from './tab-buttons/TabButtons';
import ResultHolder from './result-holder/ResultHolder';
import { RootState } from 'src/store';

type Props = StateProps;

const Content = (props: Props) => {
  return (
    <div>
      <div className={styles.resultList}>
        <ResultHolder />
      </div>
      <div className={styles.tabList}>
        <TabButtons />
      </div>
      <div className={styles.dataSelector}>
        {props.selectedTabButton === 'data' && <DataSelector />}
        {props.selectedTabButton === 'filter' && <ResultFilter />}
      </div>
    </div>
  );
};

type StateProps = {
  selectedTabButton: string;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedTabButton: getSelectedTabButton(state)
});

export default connect(mapStateToProps)(Content);
