import React from 'react';
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

import { getFilters } from '../content/filter-accordion/state/filterAccordionSelector';
import { getAttributes } from '../content/attributes-accordion/state/attributesAccordionSelector';

import {
  togglePreFiltersPanel,
  setShowPreview,
  setDownloadType
} from '../../state/customDownloadActions';
import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as BackIcon } from 'static/img/shared/chevron-left.svg';

import {
  getSelectedAttributes,
  getSelectedFilters
} from '../content/result-holder/resultHolderHelper';

import { fetchCustomDownloadResults } from './customDownloadHeaderHelper';

import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import AttributesSection, {
  SelectedAttribute
} from 'src/content/app/custom-download/types/Attributes';

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
  // {
  //   label: 'CSV.gz',
  //   value: 'text/csv',
  //   isSelected: false
  // },
  // {
  //   label: 'HTML',
  //   value: 'application/json',
  //   isSelected: false
  // },
  // {
  //   label: 'TSV',
  //   value: 'application/json',
  //   isSelected: false
  // },
  // {
  //   label: 'TSV.gz',
  //   value: 'application/json',
  //   isSelected: false
  // },
  // {
  //   label: 'URL',
  //   value: 'application/json',
  //   isSelected: false
  // },
  // {
  //   label: 'XML',
  //   value: 'application/xml',
  //   isSelected: false
  // },
  // {
  //   label: 'XLS',
  //   value: 'application/xml',
  //   isSelected: false
  // },
  // {
  //   label: 'XLS.gz',
  //   value: 'application/xml',
  //   isSelected: false
  // }
];

const Header = (props: Props) => {
  const filterOnClick = () => {
    props.togglePreFiltersPanel(true);
  };

  const previewButtonOnClick = () => {
    props.setShowPreview(true);
  };

  const showFilters = () => {
    props.setShowPreview(false);
  };

  let resultCount = getCommaSeparatedNumber(props.preview.resultCount);

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

  let disablePreviewButton = resultCount === '0';

  const selectedAttributes: SelectedAttribute[] = getSelectedAttributes(
    props.attributes
  );
  const selectedFilters: any = getSelectedFilters(props.filters);

  const getFormattedResult = () => {
    if (resultCount === '0') {
      return <span>No results found</span>;
    }
    return (
      <>
        <span>{resultCount}</span> results
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      {!props.showPreview && (
        <div className={styles.resultCounter}>{getFormattedResult()}</div>
      )}

      {props.showPreview && (
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

      {props.showPreview && (
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
        {!props.showPreview && (
          <PrimaryButton
            onClick={previewButtonOnClick}
            isDisabled={disablePreviewButton}
          >
            Preview download
          </PrimaryButton>
        )}
        {props.showPreview && (
          <PrimaryButton
            isDisabled={downloadButtonStatus}
            onClick={() => {
              fetchCustomDownloadResults(
                props.downloadType,
                selectedAttributes,
                selectedFilters
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
  preview: any;
  showPreview: boolean;
  downloadType: string;
  filters: any;
  attributes: AttributesSection;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedPreFilter: getSelectedPreFilter(state),
  preview: getPreviewResult(state),
  showPreview: getShowPreviewResult(state),
  downloadType: getDownloadType(state),
  filters: getFilters(state),
  attributes: getAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
