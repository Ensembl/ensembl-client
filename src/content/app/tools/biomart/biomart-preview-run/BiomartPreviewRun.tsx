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

import { useAppDispatch, useAppSelector } from 'src/store';
import {
  columnSelectionData,
  filterData
} from 'src/content/app/tools/biomart/state/biomartSelectors';

import CloseButton from 'src/shared/components/close-button/CloseButton';
import { setPreviewRunOpen } from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from './BiomartPreviewRun.module.css';

const BiomartPreviewRun = () => {
  const dispatch = useAppDispatch();
  const selectedSpecies = useAppSelector(
    (state) => state.biomart.general.selectedSpecies
  );
  const columnsData = useAppSelector(columnSelectionData);
  const filtersData = useAppSelector(filterData);

  const closePreviewRun = () => {
    dispatch(setPreviewRunOpen(false));
  };

  return (
    <div className={styles.biomartPreviewTableGrid}>
      <div className={styles.biomartPreviewTableContainer}>
        <div className={styles.biomartPreviewTable}>
          <div className={styles.biomartPreviewTableHeaderRow}>
            <div className={styles.biomartPreviewTableCell}>Species</div>
            <div className={styles.biomartPreviewTableCell}>
              Data to download
            </div>
            <div className={styles.biomartPreviewTableCell}>Filters</div>
          </div>
          <div className={styles.biomartPreviewTableRow}>
            <div className={styles.biomartPreviewTableCell}>
              {selectedSpecies?.common_name} ({selectedSpecies?.scientific_name}
              )
            </div>
            <div className={styles.biomartPreviewTableCell}>
              {columnsData &&
                columnsData.map((column) => {
                  if (!column.options) {
                    return null;
                  }
                  if (!column.options.some((option) => option.checked)) {
                    return null;
                  }
                  return (
                    <div key={column.label}>
                      <span>
                        <b>{column.label}</b>:{' '}
                        {column.options
                          .filter((option) => option.checked)
                          .map((option) => option.label)
                          .join(', ')}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className={styles.biomartPreviewTableCell}>
              {filtersData && (
                <div>
                  <div>
                    {filtersData.region?.chromosomes?.output &&
                    filtersData.region?.chromosomes?.output.length > 0 ? (
                      <span>
                        <b>Chromosomes</b>:{' '}
                        {filtersData.region.chromosomes.output.join(', ')}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {filtersData.region?.coordinates?.output &&
                    filtersData.region?.coordinates?.output.length > 0 ? (
                      <span>
                        <b>Coordinates</b>:{' '}
                        {filtersData.region.coordinates.output[0]} -{' '}
                        {filtersData.region.coordinates.output[1]}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {filtersData.gene?.gene_types?.output &&
                    filtersData.gene?.gene_types?.output.length > 0 ? (
                      <span>
                        <b>Gene types</b>:{' '}
                        {filtersData.gene.gene_types.output.join(', ')}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {filtersData.gene?.gene_sources?.output &&
                    filtersData.gene?.gene_sources?.output.length > 0 ? (
                      <span>
                        <b>Gene sources</b>:{' '}
                        {filtersData.gene.gene_sources.output.join(', ')}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {filtersData.gene?.transcript_types?.output &&
                    filtersData.gene?.transcript_types?.output.length > 0 ? (
                      <span>
                        <b>Transcript types</b>:{' '}
                        {filtersData.gene.transcript_types.output.join(', ')}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {filtersData.gene?.transcript_sources?.output &&
                    filtersData.gene?.transcript_sources?.output.length > 0 ? (
                      <span>
                        <b>Transcript sources</b>:{' '}
                        {filtersData.gene.transcript_sources.output.join(', ')}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {filtersData.gene?.gene_stable_id?.output &&
                    filtersData.gene?.gene_stable_id?.output.length > 0 ? (
                      <span>
                        <b>Gene stable ID</b>:{' '}
                        {filtersData.gene.gene_stable_id.output.join(', ')}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {filtersData.gene?.transcript_stable_id?.output &&
                    filtersData.gene?.transcript_stable_id?.output.length >
                      0 ? (
                      <span>
                        <b>Transcript stable ID</b>:{' '}
                        {filtersData.gene.transcript_stable_id.output.join(
                          ', '
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.biomartCloseButtonContainer}>
        <CloseButton onClick={closePreviewRun} />
      </div>
    </div>
  );
};

export default BiomartPreviewRun;
