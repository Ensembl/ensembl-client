import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getPreviewResult,
  getIsLoadingResult
} from '../../../state/customDownloadSelectors';

import { getAttributes } from '../attributes-accordion/state/attributesAccordionSelector';
import { getFilters } from '../filter-accordion/state/filterAccordionSelector';

import {
  setPreviewResult,
  setIsLoadingResult,
  fetchPreviewResult
} from '../../../state/customDownloadActions';

import styles from './ResultHolder.scss';

import { CircleLoader } from 'src/shared/loader/Loader';

import {
  getSelectedAttributes,
  formatResults,
  getEndpointUrl
} from './helpers';

type Props = StateProps & DispatchProps;

const ResultHolder = (props: Props) => {
  const selectedAttributes: any = getSelectedAttributes(props.attributes);

  useEffect(() => {
    if (!selectedAttributes.length && props.previewResult.results) {
      props.clearPreviewResult([]);
      return;
    }
    props.setIsLoadingResult(true);

    const endpointURL = getEndpointUrl(selectedAttributes);
    if (selectedAttributes.length) {
      props.fetchPreviewResult(endpointURL);
    }
  }, [props.attributes, props.filters]);

  useEffect(() => {
    props.setIsLoadingResult(false);
  }, [props.previewResult]);

  if (
    props.isLoadingResult &&
    props.previewResult &&
    !props.previewResult.results
  ) {
    return (
      <>
        {Array(10)
          .fill(1)
          .map((value, key: number) => {
            return (
              <div key={key} className={styles.wrapper}>
                <div className={styles.resultCard}>
                  <div className={styles.loaderWrapper}>
                    <CircleLoader />
                  </div>
                </div>
              </div>
            );
          })}
      </>
    );
  }

  if (!props.previewResult.results) {
    return null;
  }

  const formattedResults = formatResults(
    props.previewResult,
    selectedAttributes
  );

  const headerRow = formattedResults.shift();

  return (
    <div className={styles.wrapper}>
      {formattedResults.map((dataRow: [], resultKey: number) => {
        return (
          <div key={resultKey} className={styles.resultCard}>
            {props.isLoadingResult && (
              <div className={styles.loaderWrapper}>
                <CircleLoader />
              </div>
            )}

            {headerRow.map((header: string, rowKey: number) => {
              return (
                <div key={rowKey} className={styles.resultLine}>
                  <div className={styles.lineHeader}>{header}</div>
                  <div className={styles.lineValue}>
                    {dataRow[rowKey] ? dataRow[rowKey] : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

type DispatchProps = {
  fetchPreviewResult: (fetchPreviewResult: any) => void;
  clearPreviewResult: (clearPreviewResult: any) => void;
  setIsLoadingResult: (setIsLoadingResult: boolean) => void;
};

const mapDispatchToProps: DispatchProps = {
  fetchPreviewResult: fetchPreviewResult,
  clearPreviewResult: setPreviewResult.success,
  setIsLoadingResult
};

type StateProps = {
  attributes: any;
  filters: any;
  previewResult: any;
  isLoadingResult: boolean;
};

const mapStateToProps = (state: RootState): StateProps => ({
  attributes: getAttributes(state),
  filters: getFilters(state),
  previewResult: getPreviewResult(state),
  isLoadingResult: getIsLoadingResult(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultHolder);
