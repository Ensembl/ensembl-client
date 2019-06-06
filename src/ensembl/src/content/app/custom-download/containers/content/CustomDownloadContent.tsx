import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './CustomDownloadContent.scss';
import {
  getSelectedTabButton,
  getShowPreviewResult,
  getPreviewResult
} from '../../state/customDownloadSelectors';
import { setAttributes } from './attributes-accordion/state/attributesAccordionActions';
import { getAttributes } from './attributes-accordion/state/attributesAccordionSelector';

import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FiltersAccordion from './filter-accordion/FiltersAccordion';
import TabButtons from './tab-buttons/TabButtons';
import ResultHolder from './result-holder/ResultHolder';
import { RootState } from 'src/store';
import { attributes } from '../../sampledata';
import PreviewTable from '../../components/preview-table/PreviewTable';

import { getSelectedAttributes, formatResults } from './result-holder/helpers';

type Props = StateProps & DispatchProps;

const Content = (props: Props) => {
  useEffect(() => {
    props.setAttributes(attributes);
  }, []);

  const selectedAttributes: any = getSelectedAttributes(props.attributes);
  let formatedPreviewResult = [];
  if (props.previewResult.results) {
    formatedPreviewResult = formatResults(
      props.previewResult,
      selectedAttributes
    );
  }

  return (
    <div>
      {!props.showPreview && (
        <div>
          <div className={styles.resultList}>
            <ResultHolder />
          </div>
          <div className={styles.tabList}>
            <TabButtons />
          </div>
          <div className={styles.dataSelector}>
            {props.selectedTabButton === 'attributes' && (
              <AttributesAccordion />
            )}
            {props.selectedTabButton === 'filter' && <FiltersAccordion />}
          </div>
        </div>
      )}
      {props.showPreview && (
        <div>
          {' '}
          <PreviewTable resultData={formatedPreviewResult} />{' '}
        </div>
      )}
    </div>
  );
};

type StateProps = {
  selectedTabButton: string;
  showPreview: boolean;
  previewResult: any;
  attributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedTabButton: getSelectedTabButton(state),
  showPreview: getShowPreviewResult(state),
  previewResult: getPreviewResult(state),
  attributes: getAttributes(state)
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
