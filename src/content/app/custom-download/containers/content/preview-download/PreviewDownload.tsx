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
import get from 'lodash/get';
import { connect } from 'react-redux';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { setShowPreview } from 'src/content/app/custom-download/state/customDownloadActions';
import { getDisplayName } from 'src/shared/components/selected-species/selectedSpeciesHelpers';
import { getProcessedFilters } from 'src/content/app/custom-download/containers/header/customDownloadHeaderHelper';
import {
  getCustomDownloadActiveGenomeId,
  getPreviewResult
} from 'src/content/app/custom-download/state/customDownloadSelectors';
import { getSelectedAttributes } from 'src/content/app/custom-download/state/attributes/attributesSelector';
import { getSelectedFilters } from 'src/content/app/custom-download/state/filters/filtersSelector';

import CloseButton from 'src/shared/components/close-button/CloseButton';
import CustomDownloadInfoCard from 'src/content/app/custom-download/components/info-card/CustomDownloadInfoCard';
import PreviewCard from 'src/content/app/custom-download/containers/content/preview-card/PreviewCard';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';
import JSONValue from 'src/shared/types/JSON';

import styles from './PreviewDownload.scss';

type PreviewDownloadProps = {
  selectedAttributes: JSONValue;
  selectedFilters: JSONValue;
  preview: JSONValue;
  committedSpecies: CommittedItem | null;
  setShowPreview: (showPreview: boolean) => void;
};

const PreviewDownload = (props: PreviewDownloadProps) => {
  const resultCount: number = props.preview.resultCount
    ? (props.preview.resultCount as number)
    : 0;

  const processedFilters = getProcessedFilters(props.selectedFilters);
  const gene_ids = get(
    processedFilters,
    'protein_and_domain_families.family_or_domain_ids.limit_to_genes',
    null
  );
  const gene_biotypes = get(processedFilters, 'genes.biotype', null);
  const gene_source = get(processedFilters, 'genes.gene_source', null);

  return (
    <div className={styles.previewDownload}>
      <span className={styles.closeButton}>
        <CloseButton onClick={() => props.setShowPreview(false)} />
      </span>
      <table className={styles.previewDownloadTable}>
        <tbody>
          <tr className={styles.previewDownloadHeader}>
            <td className={styles.species}>Species</td>
            <td className={styles.example}>
              <CustomDownloadInfoCard
                title={'Example data to download'}
                classNames={{ infoCardClassName: styles.exampleDataPanel }}
              >
                <PreviewCard />
              </CustomDownloadInfoCard>
            </td>
            <td className={styles.filters}>
              Filters
              <div className={styles.resultCounter}>
                <span>{getCommaSeparatedNumber(resultCount)}</span> results
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                {props.committedSpecies &&
                  `${getDisplayName(props.committedSpecies)} ${
                    props.committedSpecies.assembly_name
                  }`}
              </div>
            </td>
            <td></td>
            <td>
              {!(gene_ids || gene_biotypes || gene_source) && (
                <div> No filters selected.</div>
              )}
              {!!gene_ids && <div>Limit to genes: {gene_ids.join(', ')}</div>}
              {!!gene_biotypes && (
                <div>Gene biotype: {Object.keys(gene_biotypes).join(', ')}</div>
              )}
              {!!gene_source && (
                <div>Gene source: {Object.keys(gene_source).join(', ')}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const mapDispatchToProps = {
  setShowPreview
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(state);
  const committedSpecies = activeGenomeId
    ? getCommittedSpeciesById(state, activeGenomeId)
    : null;

  return {
    selectedAttributes: getSelectedAttributes(state),
    selectedFilters: getSelectedFilters(state),
    preview: getPreviewResult(state),
    committedSpecies: committedSpecies
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreviewDownload);
