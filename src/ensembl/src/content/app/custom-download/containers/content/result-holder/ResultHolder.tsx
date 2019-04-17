import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import {
  getAttributes,
  getPreviewResult
} from '../../../customDownloadSelectors';

import { setPreviewResult } from '../../../customDownloadActions';

import styles from './ResultHolder.scss';

import getCustomDownloadPreviewResults from 'src/services/custom-download.ts';

const fetchPreviewResults = async (props: any) => {
  const selectedAttributes: any = [];

  Object.keys(props.attributes).forEach((section) => {
    Object.keys(props.attributes[section]).forEach((subSection) => {
      Object.keys(props.attributes[section][subSection]).forEach(
        (attributeId) => {
          if (
            props.attributes[section][subSection][attributeId].checkedStatus ===
            true
          ) {
            selectedAttributes.push([
              section,
              subSection,
              attributeId,
              props.attributes[section][subSection][attributeId].label
            ]);
          }
        }
      );
    });
  });
  if (!selectedAttributes.length) {
    return;
  }
  const previewResult = await getCustomDownloadPreviewResults(
    selectedAttributes
  );

  props.setPreviewResult(previewResult);
};

const ResultHolder = (props: StateProps) => {
  useEffect(() => {
    fetchPreviewResults(props);
  }, [props.attributes]);

  if (
    !props.previewResult.resultCount ||
    props.previewResult.resultCount === 0
  ) {
    return null;
  }

  console.log(props.previewResult);

  const headerData: string[] = [];

  props.previewResult.fields.forEach((element) => {
    let displayName = element.displayName.split('.');
    displayName = displayName.map((element) => {
      return element.charAt(0).toUpperCase() + element.slice(1);
    });

    headerData.push(displayName.join(' '));
  });

  return (
    <div className={styles.wrapper}>
      {props.previewResult.results.map((dataRow, resultKey) => {
        return (
          <div key={resultKey} className={styles.resultCard}>
            {headerData.map((currentHeader: string, rowKey: number) => {
              return (
                <div key={rowKey} className={styles.resultLine}>
                  <div className={styles.lineHeader}>{currentHeader}</div>
                  <div className={styles.lineValue}>{dataRow[rowKey]}</div>
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
};

const mapDispatchToProps: DispatchProps = {
  setPreviewResult
};

type StateProps = {
  attributes: any;
  previewResult: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  attributes: getAttributes(state),
  previewResult: getPreviewResult(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultHolder);
