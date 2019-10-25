import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FiltersAccordion from './filter-accordion/FiltersAccordion';
import Overlay from 'src/shared/components/overlay/Overlay';
import CustomDownloadInfoCard from '../../components/info-card/CustomDownloadInfoCard';
import PreviewCard from 'src/content/app/custom-download/containers/content/preview-card/PreviewCard';
import PreviewDownload from './preview-download/PreviewDownload';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import {
  getShowPreviewResult,
  getShowExampleData
} from 'src/content/app/custom-download/state/customDownloadSelectors';
import { setShowExampleData } from 'src/content/app/custom-download/state/customDownloadActions';

import styles from './CustomDownloadContent.scss';

type StateProps = {
  showSummary: boolean;
  showExampleData: boolean;
  launchBarExpanded: boolean;
};

type DispatchProps = {
  setShowExampleData: (showExampleData: boolean) => void;
};

type Props = StateProps & DispatchProps;

const CustomDownloadContent = (props: Props) => {
  const wrapperHeightClassName = props.launchBarExpanded
    ? styles.default
    : styles.taller;
  return (
    <div className={`${styles.wrapper} ${wrapperHeightClassName}`}>
      {props.showExampleData && (
        <>
          <Overlay />
          <CustomDownloadInfoCard
            title={'Example data to download'}
            classNames={{ infoCardClassName: styles.exampleDataPanel }}
            onClose={() => props.setShowExampleData(false)}
          >
            <PreviewCard />
          </CustomDownloadInfoCard>
        </>
      )}
      {!props.showSummary && (
        <>
          <div className={styles.attributesHolder}>
            <AttributesAccordion />
          </div>
          <div className={styles.filtersHolder}>
            <FiltersAccordion />
          </div>
        </>
      )}
      {props.showSummary && (
        <div className={styles.previewDownloadHolder}>
          <PreviewDownload />
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  setShowExampleData
};

const mapStateToProps = (state: RootState): StateProps => ({
  showSummary: getShowPreviewResult(state),
  launchBarExpanded: getLaunchbarExpanded(state),
  showExampleData: getShowExampleData(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDownloadContent);
