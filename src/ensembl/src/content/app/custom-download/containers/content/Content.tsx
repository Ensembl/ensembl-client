import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './Content.scss';
import { getSelectedTabButton } from '../../customDownloadSelectors';
import { setAttributes } from '../../customDownloadActions';
import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FilterAccordion from './filter-accordion/FilterAccordion';
import TabButtons from './tab-buttons/TabButtons';
import ResultHolder from './result-holder/ResultHolder';
import { RootState } from 'src/store';
import sampleData from '../../sampledata.json';

type Props = StateProps & DispatchProps;

const Content = (props: Props) => {
  useEffect(() => {
    props.setAttributes(sampleData);
  }, []);

  return (
    <div>
      <div className={styles.resultList}>
        <ResultHolder />
      </div>
      <div className={styles.tabList}>
        <TabButtons />
      </div>
      <div className={styles.dataSelector}>
        {props.selectedTabButton === 'attributes' && <AttributesAccordion />}
        {props.selectedTabButton === 'filter' && <FilterAccordion />}
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

type DispatchProps = {
  setAttributes: (setAttributes: {}) => void;
};

const mapDispatchToProps: DispatchProps = {
  setAttributes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
