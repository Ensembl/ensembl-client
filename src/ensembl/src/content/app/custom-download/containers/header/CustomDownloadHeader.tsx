import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { PrimaryButton } from 'src/shared/button/Button';

import RoundButton from 'src/shared/round-button/RoundButton';

import { RootState } from 'src/store';
import Select, { Option } from 'src/shared/select/Select';

import {
  getSelectedPreFilter,
  getPreviewResult,
  getShowPreviewResult,
  getDownloadType
} from '../../state/customDownloadSelectors';

import { getSelectedFilters } from '../content/filter-accordion/state/filterAccordionSelector';
import { getSelectedAttributes } from '../content/attributes-accordion/state/attributesAccordionSelector';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import JSONValue from 'src/shared/types/JSON';
import {
  togglePreFiltersPanel,
  setShowPreview,
  setDownloadType
} from '../../state/customDownloadActions';
import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as BackIcon } from 'static/img/shared/chevron-left.svg';

import { fetchCustomDownloadResults } from './customDownloadHeaderHelper';

import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import styles from './CustomDownloadHeader.scss';

type Props = StateProps & DispatchProps;

const downloadTypeoptions = [
  {
    label: 'CSV',
    value: 'text/csv',
    isSelected: false
  },
  {
    label: 'JSON',
    value: 'application/json',
    isSelected: false
  }
];

const Header = (props: Props) => {
  useEffect(() => {
    props.setShowPreview(customDownloadStorageService.getShowPreview());
  }, []);
  const filterOnClick = () => {
    props.togglePreFiltersPanel(true);
  };

  const previewButtonOnClick = () => {
    props.setShowPreview(true);
  };

  const showFilters = () => {
    props.setShowPreview(false);
  };

  let resultCount: number = props.preview.resultCount
    ? (props.preview.resultCount as number)
    : 0;

  const handleDownloadTypeSelect = (option: string) => {
    props.setDownloadType(option);
  };

  const options = downloadTypeoptions.map((option: Option) => {
    const optionClone = { ...option };
    if (optionClone.value === props.downloadType) {
      optionClone.isSelected = true;
    }
    return optionClone;
  });

  let downloadButtonStatus = props.downloadType === '';

  let disablePreviewButton = resultCount === 0;

  const getFormattedResult = () => {
    return (
      <>
        <span>{getCommaSeparatedNumber(resultCount)}</span> results
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      {!props.showSummary && (
        <div className={styles.resultCounter}>{getFormattedResult()}</div>
      )}

      {props.showSummary && (
        <>
          <div className={styles.backButton}>
            <ImageButton
              onClick={showFilters}
              description={'Back'}
              image={BackIcon}
            />
          </div>
          <div className={styles.previewCounter}>
            <div>
              <span className={styles.boldResultCounter}>{resultCount}</span>
              <span className={styles.resultsLabel}>results</span>
            </div>
            <div className={styles.saveConfiguration}>Save configuration</div>
          </div>
        </>
      )}

      <div className={styles.selectedFilters}>
        <RoundButton
          onClick={filterOnClick}
          classNames={{ inactive: styles.roundButtonInactive }}
        >
          {props.selectedPreFilter}
        </RoundButton>
      </div>

      {props.showSummary && (
        <div className={styles.downloadTypeSelectHolder}>
          <span className={styles.downloadTypeLabel}>Download as </span>
          <span className={styles.downloadTypeSelect}>
            <Select
              options={options}
              onSelect={(option: string) => {
                handleDownloadTypeSelect(option);
              }}
              placeholder={'Select'}
            />
          </span>
        </div>
      )}

      <div className={styles.previewButton}>
        {!props.showSummary && (
          <PrimaryButton
            onClick={previewButtonOnClick}
            isDisabled={disablePreviewButton}
          >
            Download summary
          </PrimaryButton>
        )}
        {props.showSummary && (
          <PrimaryButton
            isDisabled={downloadButtonStatus}
            onClick={() => {
              fetchCustomDownloadResults(
                props.downloadType,
                props.selectedAttributes,
                props.selectedfilters
              );
            }}
          >
            Download
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};

type DispatchProps = {
  togglePreFiltersPanel: (togglePreFiltersPanel: boolean) => void;
  setShowPreview: (setShowPreview: boolean) => void;
  setDownloadType: (setDownloadType: string) => void;
};

const mapDispatchToProps: DispatchProps = {
  togglePreFiltersPanel,
  setShowPreview,
  setDownloadType
};

type StateProps = {
  selectedPreFilter: string;
  preview: JSONValue;
  showSummary: boolean;
  downloadType: string;
  selectedfilters: JSONValue;
  selectedAttributes: JSONValue;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedPreFilter: getSelectedPreFilter(state),
  preview: getPreviewResult(state),
  showSummary: getShowPreviewResult(state),
  downloadType: getDownloadType(state),
  selectedfilters: getSelectedFilters(state),
  selectedAttributes: getSelectedAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
