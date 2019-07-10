import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getPreviewResult,
  getIsLoadingResult
} from '../../../state/customDownloadSelectors';

import { getSelectedAttributes } from '../attributes-accordion/state/attributesAccordionSelector';
import { getSelectedFilters } from '../filter-accordion/state/filterAccordionSelector';

import { keys, values, mapKeys } from 'lodash';

import {
  setPreviewResult,
  setIsLoadingResult,
  fetchPreviewResult
} from '../../../state/customDownloadActions';

import styles from './ResultHolder.scss';

import { CircleLoader } from 'src/shared/loader/Loader';

import {
  formatResults,
  flattenObject,
  getEndpointUrl
} from './resultHolderHelper';

type Props = StateProps & DispatchProps;

const ResultHolder = (props: Props) => {
  useEffect(() => {
    const selectedAttributes: { [key: string]: boolean } = flattenObject(
      props.selectedAttributes
    );

    const totalSelectedAttributes = keys(selectedAttributes).length;
    if (!totalSelectedAttributes && props.preview.results) {
      props.clearPreviewResult({});
      return;
    } else if (!totalSelectedAttributes) {
      return;
    }

    const processedAttributes = keys(
      mapKeys(selectedAttributes, (value: boolean, key: string) => {
        return key
          .split('.default')
          .join('')
          .split('genes.')
          .join('');
      })
    );

    const selectedFilters: { [key: string]: boolean } = flattenObject(
      props.selectedFilters
    );

    const processedFilters = mapKeys(
      selectedFilters,
      (value: boolean, key: string) => {
        return key
          .split('.default')
          .join('')
          .split('genes.')
          .join('');
      }
    );

    const endpointURL = getEndpointUrl(processedAttributes, processedFilters);
    if (processedAttributes.length) {
      props.setIsLoadingResult(true);
      props.fetchPreviewResult(endpointURL);
    }
  }, [props.selectedAttributes, props.selectedFilters]);

  useEffect(() => {
    props.setIsLoadingResult(false);
  }, [props.preview]);

  if (props.preview && !props.preview.results && props.isLoadingResult) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
      </div>
    );
  }

  if (!props.preview.results) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.noResult}>Sorry, no results</div>
      </div>
    );
  }

  const formattedResults = formatResults(props.preview);

  const headerRow = formattedResults.shift() || [];

  return (
    <>
      {props.isLoadingResult && (
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
      )}
      <div className={styles.wrapper}>
        {formattedResults.map((dataRow: string[], resultKey: number) => {
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
    </>
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
  selectedAttributes: any;
  selectedFilters: any;
  preview: any;
  isLoadingResult: boolean;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state),
  selectedFilters: getSelectedFilters(state),
  preview: getPreviewResult(state),
  isLoadingResult: getIsLoadingResult(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultHolder);
