import React from 'react';
import { connect } from 'react-redux';
import styles from './CustomDownloadContent.scss';
import {
  getSelectedTabButton,
  getShowPreviewResult,
  getPreviewResult
} from '../../state/customDownloadSelectors';
import { getAttributes } from './attributes-accordion/state/attributesAccordionSelector';

import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FiltersAccordion from './filter-accordion/FiltersAccordion';
import TabButtons from './tab-buttons/TabButtons';
import ResultHolder from './result-holder/ResultHolder';
import { RootState } from 'src/store';
import PreviewDownload from './preview-download/PreviewDownload';

import { getSelectedAttributes, formatResults } from './result-holder/helpers';

type Props = {
  selectedTabButton: string;
  showPreview: boolean;
  previewResult: any;
  attributes: any;
};

const Content = (props: Props) => {
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
          <PreviewDownload resultData={formatedPreviewResult} />{' '}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState): Props => ({
  selectedTabButton: getSelectedTabButton(state),
  showPreview: getShowPreviewResult(state),
  previewResult: getPreviewResult(state),
  attributes: getAttributes(state)
});

export default connect(mapStateToProps)(Content);
