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

import styles from './BiomartPreviewRun.module.css';
import { useAppSelector } from 'src/store';
import { ColumnHead, Table } from 'src/shared/components/table';
import { columnSelectionData, filterData } from '../state/biomartSelectors';

const BiomartPreviewRun = () => {
  const selectedSpecies = useAppSelector(
    (state) => state.biomart.general.selectedSpecies
  );
  const columnsData = useAppSelector(columnSelectionData);
  const filtersData = useAppSelector(filterData);

  return (
    <div className={styles.biomartPreviewTable}>
      <Table stickyHeader={true} className={styles.biomartPreviewTable}>
        <thead>
          <tr>
            <ColumnHead>Species</ColumnHead>
            <ColumnHead>Data to download</ColumnHead>
            <ColumnHead>Filters</ColumnHead>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {selectedSpecies?.common_name} ({selectedSpecies?.scientific_name}
              )
            </td>
            <td>
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
            </td>
            <td>
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
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default BiomartPreviewRun;
