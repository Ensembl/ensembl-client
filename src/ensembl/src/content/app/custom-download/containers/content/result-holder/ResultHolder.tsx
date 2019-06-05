import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getPreviewResult,
  getIsLoadingResult
} from '../../../customDownloadSelectors';

import { getAttributes } from '../attributes-accordion/attributesAccordionSelector';
import { getFilters } from '../filter-accordion/filterAccordionSelector';
import apiService from 'src/services/api-service';

import {
  setPreviewResult,
  setIsLoadingResult
} from '../../../customDownloadActions';

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
      props.setPreviewResult([]);
      return;
    }
    props.setIsLoadingResult(true);

    props.setPreviewResult({});
    const endpointURL = getEndpointUrl(selectedAttributes);

    apiService
      .fetch(endpointURL, {
        headers: {
          'Content-Type': 'application/json'
        },
        preserveEndpoint: true
      })
      .then((response: any) => {
        props.setPreviewResult(response);
      });
  }, [props.attributes, props.filters]);

  useEffect(() => {
    props.setIsLoadingResult(false);
  }, [props.previewResult]);

  if (props.isLoadingResult) {
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
  setPreviewResult: (setPreviewResult: any) => void;
  setIsLoadingResult: (setIsLoadingResult: boolean) => void;
};

const mapDispatchToProps: DispatchProps = {
  setPreviewResult: setPreviewResult.success,
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
