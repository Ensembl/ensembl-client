import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { SecondaryButton, PrimaryButton } from 'src/shared/button/Button';

import RoundButton, {
  RoundButtonStatus
} from 'src/shared/round-button/RoundButton';

import { RootState } from 'src/store';
import Select, { Option } from 'src/shared/select/Select';

import {
  getSelectedPreFilter,
  getPreviewResult,
  getShowPreviewResult,
  getDownloadType
} from '../../customDownloadSelectors';

import { getFilters } from '../content/filter-accordion/filterAccordionSelector';
import { getAttributes } from '../content/attributes-accordion/attributesAccordionSelector';

import {
  togglePreFiltersPanel,
  setShowPreview,
  setDownloadType
} from '../../customDownloadActions';
import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as BackIcon } from 'static/img/shared/chevron-left.svg';

import {
  getSelectedAttributes,
  getSelectedFilters
} from '../content/result-holder/helpers';

import { fetchCustomDownloadResults } from 'src/services/custom-download';

import styles from './Header.scss';

type Props = StateProps & DispatchProps;

const downloadTypeSelectOptions = [
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

const getFormattedTotal = (total: number) => {
  if (!total) {
    return 0;
  }
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Header = (props: Props) => {
  const filterOnClick = () => {
    props.togglePreFiltersPanel(true);
  };

  const previewButtonOnClick = useCallback(() => {
    props.setShowPreview(true);
  }, [props.showPreview]);

  const showFilters = useCallback(() => {
    props.setShowPreview(false);
  }, [props.showPreview]);

  const resultCount = getFormattedTotal(props.previewResult.resultCount);

  const handleDownloadTypeSelect = useCallback(
    (option: string) => {
      props.setDownloadType(option);
    },
    [props.downloadType]
  );

  const selectOptions = [...downloadTypeSelectOptions].map((option: Option) => {
    const optionClone = { ...option };
    if (optionClone.value === props.downloadType) {
      optionClone.isSelected = true;
    }
    return optionClone;
  });

  let downloadButtonStatus = true;
  if (props.downloadType !== '') {
    downloadButtonStatus = false;
  }
  const selectedAttributes: any = getSelectedAttributes(props.attributes);
  const selectedFilters: any = getSelectedFilters(props.filters);

  return (
    <div className={styles.wrapper}>
      {!props.showPreview && (
        <div className={styles.resultCounter}>
          <span>{resultCount} results</span>
        </div>
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
          <div className={styles.previewResultCounter}>
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
          status={RoundButtonStatus.ACTIVE}
          classNames={styles}
        >
          {props.selectedPreFilter}
        </RoundButton>
        {props.showPreview && (
          <div className={styles.downloadTypeSelectHolder}>
            <span className={styles.downloadTypeLabel}>Download as </span>
            <span className={styles.downloadTypeSelect}>
              <Select
                options={selectOptions}
                onSelect={(option: string) => {
                  handleDownloadTypeSelect(option);
                }}
                placeholder={'Select'}
              />
            </span>
          </div>
        )}
      </div>

      <div className={styles.previewButton}>
        {!props.showPreview && (
          <SecondaryButton onClick={previewButtonOnClick}>
            Preview download
          </SecondaryButton>
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
  previewResult: any;
  showPreview: boolean;
  downloadType: string;
  filters: any;
  attributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedPreFilter: getSelectedPreFilter(state),
  previewResult: getPreviewResult(state),
  showPreview: getShowPreviewResult(state),
  downloadType: getDownloadType(state),
  filters: getFilters(state),
  attributes: getAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
