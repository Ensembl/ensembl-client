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
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { Table } from 'src/shared/components/table';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import SolidDot from 'src/shared/components/table/dot/SolidDot';
import EmptyDot from 'src/shared/components/table/dot/EmptyDot';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import DisabledExternalLink from 'src/shared/components/external-link/DisabledExternalLink';

import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';
import type { SelectableGenome } from 'src/content/app/new-species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import styles from './SpeciesSearchResultsTable.scss';

type Props = {
  isExpanded: boolean;
  results: SelectableGenome[];
  onTableExpandToggle: () => void;
  onSpeciesSelectToggle: (
    species: SpeciesSearchMatch,
    isAdding?: boolean
  ) => void;
};

const SpeciesSearchResultsTable = (props: Props) => {
  const { isExpanded, results, onSpeciesSelectToggle } = props;

  const onSpeciesPreselect = (species: SelectableGenome) => {
    const isAdding = !species.isStaged;
    onSpeciesSelectToggle(species, isAdding);
  };

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          <th>Select to add</th>
          <th>Common name</th>
          <th>Scientific name</th>
          <th>Type</th>
          <th>Assembly</th>
          <th>Assembly accession</th>

          <th>
            <ShowMore {...props} />
          </th>

          {isExpanded && (
            <>
              <th>Coding genes</th>
              <th>N50</th>
              <th>Variation</th>
              <th>Regulation</th>
              <th>Annotation provider</th>
              <th>Annotation method</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {results.map((searchMatch) => (
          <tr
            key={searchMatch.genome_id}
            className={classNames({
              [styles.isAlreadySelected]: searchMatch.isSelected
            })}
          >
            <td>
              <Checkbox
                disabled={searchMatch.isSelected}
                checked={searchMatch.isStaged}
                onChange={() => onSpeciesPreselect(searchMatch)}
              />
            </td>
            <td>{searchMatch.common_name ?? '-'}</td>
            <td>{searchMatch.scientific_name}</td>
            <td>
              <SpeciesType species={searchMatch} />
            </td>
            <td className={styles.assemblyName}>{searchMatch.assembly.name}</td>
            <td>
              {!searchMatch.isSelected ? (
                <ExternalLink
                  to={searchMatch.assembly.url}
                  linkText={searchMatch.assembly.accession_id}
                />
              ) : (
                <DisabledExternalLink>
                  {searchMatch.assembly.accession_id}
                </DisabledExternalLink>
              )}
            </td>

            {/* empty column under the 'show more' heading */}
            <td />

            {isExpanded && (
              <>
                <td>{formatNumber(searchMatch.coding_genes_count)}</td>
                <td>
                  {searchMatch.contig_n50
                    ? formatNumber(searchMatch.contig_n50)
                    : '-'}
                </td>
                <td>
                  {searchMatch.has_variation ? <SolidDot /> : <EmptyDot />}
                </td>
                <td>
                  {searchMatch.has_regulation ? <SolidDot /> : <EmptyDot />}
                </td>
                <td>{searchMatch.annotation_provider}</td>
                <td>{searchMatch.annotation_method}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ShowMore = (props: Props) => {
  const { isExpanded, onTableExpandToggle } = props;
  const text = isExpanded ? 'Show less' : 'Show more';

  return (
    <button className={styles.showMore} onClick={onTableExpandToggle}>
      {text}
    </button>
  );
};

const SpeciesType = (props: { species: SpeciesSearchMatch }) => {
  const { type: speciesType, is_reference } = props.species;

  const referenceElement = is_reference ? (
    <span className={styles.referenceGenome}>Reference</span>
  ) : null;

  const speciesTypeText = speciesType
    ? `${upperFirst(speciesType.kind)} - ${speciesType.value}`
    : null;

  if (!referenceElement && !speciesTypeText) {
    return '-';
  }

  return (
    <>
      {speciesTypeText}
      {speciesTypeText && referenceElement && ', '}
      {referenceElement}
    </>
  );
};

export default SpeciesSearchResultsTable;
