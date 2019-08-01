import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getPreviewResult,
  getIsLoadingResult
} from '../../../state/customDownloadSelectors';

import { getSelectedAttributes } from '../../../state/attributes/attributesSelector';
import { getSelectedFilters } from '../../../state/filters/filterSelector';

import {
  setPreviewResult,
  setIsLoadingResult,
  fetchPreviewResult
} from '../../../state/customDownloadActions';

import styles from './ResultHolder.scss';

import { CircleLoader } from 'src/shared/loader/Loader';
import JSONValue from 'src/shared/types/JSON';

import {
  formatResults,
  flattenObject,
  getEndpointUrl
} from './resultHolderHelper';

type Props = StateProps & DispatchProps;

const ResultHolder = (props: Props) => {
  useEffect(() => {
    const flatSelectedAttributes: { [key: string]: boolean } = flattenObject(
      props.selectedAttributes
    );

    const totalSelectedAttributes = Object.keys(flatSelectedAttributes).length;
    if (!totalSelectedAttributes && props.preview.results) {
      props.clearPreviewResult();
      return;
    } else if (!totalSelectedAttributes) {
      return;
    }

    const endpointURL = getEndpointUrl(
      flatSelectedAttributes,
      props.selectedFilters
    );

    if (totalSelectedAttributes) {
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

  const formattedResults = formatResults(
    props.preview,
    props.selectedAttributes
  );
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
        })}
      </div>
    </>
  );
};

type DispatchProps = {
  fetchPreviewResult: (fetchPreviewResult: string) => void;
  clearPreviewResult: () => void;
  setIsLoadingResult: (setIsLoadingResult: boolean) => void;
};

const mapDispatchToProps: DispatchProps = {
  fetchPreviewResult: fetchPreviewResult,
  clearPreviewResult: () => setPreviewResult.success({}),
  setIsLoadingResult
};

type StateProps = {
  selectedAttributes: JSONValue;
  selectedFilters: JSONValue;
  preview: JSONValue;
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
