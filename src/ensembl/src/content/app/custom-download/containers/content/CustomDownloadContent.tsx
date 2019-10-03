import React from 'react';
import { connect } from 'react-redux';
import styles from './CustomDownloadContent.scss';
import { getShowPreviewResult } from '../../state/customDownloadSelectors';

import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FiltersAccordion from './filter-accordion/FiltersAccordion';
import ResultLoader from './result-loader/ResultLoader';
import { RootState } from 'src/store';
import PreviewDownload from './preview-download/PreviewDownload';

type Props = {
  showSummary: boolean;
};

const Content = (props: Props) => {
  return (
    <div>
      <ResultLoader />
      {!props.showSummary && (
        <div>
          <div className={styles.attributesHolder}>
            <AttributesAccordion />
          </div>
          <div className={styles.filtersHolder}>
            <FiltersAccordion />
          </div>
        </div>
      )}
      {props.showSummary && (
        <div>
          <PreviewDownload />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState): Props => ({
  showSummary: getShowPreviewResult(state)
});

export default connect(mapStateToProps)(Content);
