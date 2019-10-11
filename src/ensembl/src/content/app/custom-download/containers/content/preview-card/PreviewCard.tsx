import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getPreviewResult,
  getIsLoadingResult
} from '../../../state/customDownloadSelectors';

import { getSelectedAttributes } from '../../../state/attributes/attributesSelector';
import { getSelectedFilters } from '../../../state/filters/filtersSelector';

import { formatResults } from './previewCardHelper';

import JSONValue from 'src/shared/types/JSON';

import styles from './PreviewCard.scss';

type Props = {
  selectedAttributes: JSONValue;
  selectedFilters: JSONValue;
  preview: JSONValue;
  isLoadingResult: boolean;
};

const ResultLoader = (props: Props) => {
  const formattedResults = formatResults(
    props.preview,
    props.selectedAttributes
  );
  const headerRow = formattedResults.shift() || [];
  const dataRow = formattedResults.shift() || [];

  if (!dataRow.length) {
    return (
      <div className={styles.loaderWrapper}>
        There is no data to display. Please select different filters to try
        again.
      </div>
    );
  }

  return (
    <div className={styles.resultCard}>
      {headerRow.map((header: string, rowKey: number) => {
        return (
          <div key={rowKey} className={styles.resultLine}>
            <div className={styles.lineHeader} title={header}>
              {header}
            </div>
            <div className={styles.lineValue}>
              {dataRow[rowKey] ? dataRow[rowKey] : '-'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: RootState): Props => ({
  selectedAttributes: getSelectedAttributes(state),
  selectedFilters: getSelectedFilters(state),
  preview: getPreviewResult(state),
  isLoadingResult: getIsLoadingResult(state)
});

export default connect(mapStateToProps)(ResultLoader);
