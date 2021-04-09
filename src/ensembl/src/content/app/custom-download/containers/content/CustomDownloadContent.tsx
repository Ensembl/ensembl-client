/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { connect } from 'react-redux';

import AttributesAccordion from './attributes-accordion/AttributesAccordion';
import FiltersAccordion from './filter-accordion/FiltersAccordion';
import Overlay from 'src/shared/components/overlay/Overlay';
import CustomDownloadInfoCard from '../../components/info-card/CustomDownloadInfoCard';
import PreviewCard from 'src/content/app/custom-download/containers/content/preview-card/PreviewCard';
import PreviewDownload from './preview-download/PreviewDownload';
import {
  getShowPreviewResult,
  getShowExampleData
} from 'src/content/app/custom-download/state/customDownloadSelectors';
import { setShowExampleData } from 'src/content/app/custom-download/state/customDownloadActions';

import { RootState } from 'src/store';

import styles from './CustomDownloadContent.scss';

type StateProps = {
  showSummary: boolean;
  showExampleData: boolean;
};

type DispatchProps = {
  setShowExampleData: (showExampleData: boolean) => void;
};

type Props = StateProps & DispatchProps;

const CustomDownloadContent = (props: Props) => {
  return (
    <div className={styles.wrapper}>
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
  showExampleData: getShowExampleData(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDownloadContent);
