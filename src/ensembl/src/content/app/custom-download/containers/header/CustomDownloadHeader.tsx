import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  PrimaryButton,
  SecondaryButton
} from 'src/shared/components/button/Button';

import RoundButton from 'src/shared/components/round-button/RoundButton';

import { RootState } from 'src/store';
import Select, { Option } from 'src/shared/components/select/Select';

import {
  getSelectedPreFilter,
  getPreviewResult,
  getShowPreviewResult,
  getDownloadType
} from '../../state/customDownloadSelectors';

import { getSelectedFilters } from '../../state/filters/filtersSelector';
import { getSelectedAttributes } from '../../state/attributes/attributesSelector';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import JSONValue from 'src/shared/types/JSON';
import {
  togglePreFiltersPanel,
  setShowPreview,
  setDownloadType
} from '../../state/customDownloadActions';

import { fetchCustomDownloadResults } from './customDownloadHeaderHelper';

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

  const resultCount: number = props.preview.resultCount
    ? (props.preview.resultCount as number)
    : 0;

  const disablePreviewButton = resultCount === 0;

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

  const downloadButtonStatus = props.downloadType === '';

  return (
    <div className={styles.wrapper}>
      {props.showSummary && (
        <>
          <div className={styles.backButton}>
            <SecondaryButton onClick={showFilters}>Back</SecondaryButton>
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

        <span className={styles.changeLink} onClick={filterOnClick}>
          Change
        </span>
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
          <SecondaryButton
            onClick={previewButtonOnClick}
            isDisabled={disablePreviewButton}
          >
            Preview download
          </SecondaryButton>
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
