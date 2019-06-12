import React from 'react';
import { connect } from 'react-redux';
import styles from './CustomDownloadContent.scss';
import {
  getSelectedTabButton,
  getShowPreviewResult,
  getPreviewResult
} from '../../state/customDownloadSelectors';

import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FiltersAccordion from './filter-accordion/FiltersAccordion';
import TabButtons from './tab-buttons/TabButtons';
import ResultHolder from './result-holder/ResultHolder';
import { RootState } from 'src/store';
import PreviewDownload from './preview-download/PreviewDownload';

type Props = {
  selectedTabButton: string;
  showPreview: boolean;
  preview: any;
};

const Content = (props: Props) => {
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
          <PreviewDownload />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState): Props => ({
  selectedTabButton: getSelectedTabButton(state),
  showPreview: getShowPreviewResult(state),
  preview: getPreviewResult(state)
});

export default connect(mapStateToProps)(Content);
