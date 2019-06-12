import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getPreviewResult,
  getIsLoadingResult
} from '../../../state/customDownloadSelectors';

import { getAttributes } from '../attributes-accordion/state/attributesAccordionSelector';
import { getFilters } from '../filter-accordion/state/filterAccordionSelector';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

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
  const selectedAttributes: AttributesSection = getSelectedAttributes(
    props.attributes
  );

  useEffect(() => {
    if (!selectedAttributes.length && props.preview.results) {
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
  }, [props.preview]);

  if (props.preview && !props.preview.results && props.isLoadingResult) {
    return (
      <>
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
        <div className={styles.wrapper}>
          {Array(15)
            .fill('')
            .map((value, key: number) => {
              return (
                <div key={key} className={styles.resultCard}>
                  {value}
                </div>
              );
            })}
        </div>
      </>
    );
  }

  if (!props.preview.results) {
    return null;
  }

  const formattedResults = formatResults(props.preview, selectedAttributes);

  const headerRow = formattedResults.shift();

  return (
    <>
      {props.isLoadingResult && (
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
      )}
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
  attributes: AttributesSection;
  filters: any;
  preview: any;
  isLoadingResult: boolean;
};

const mapStateToProps = (state: RootState): StateProps => ({
  attributes: getAttributes(state),
  filters: getFilters(state),
  preview: getPreviewResult(state),
  isLoadingResult: getIsLoadingResult(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultHolder);
