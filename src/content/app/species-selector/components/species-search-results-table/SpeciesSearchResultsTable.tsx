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

import classNames from 'classnames';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { Table, ColumnHead } from 'src/shared/components/table';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import SolidDot from 'src/shared/components/table/dot/SolidDot';
import EmptyDot from 'src/shared/components/table/dot/EmptyDot';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import DisabledExternalLink from 'src/shared/components/external-link/DisabledExternalLink';
import {
  CommonName,
  ScientificName,
  AssemblyName,
  AssemblyAccessionId,
  SpeciesType,
  GenomeRelease,
  GenomeReleaseType
} from 'src/shared/components/species-name-parts-for-table';

import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';
import type { SelectableGenome } from 'src/content/app/species-selector/components/selectable-genomes-table/useSelectableGenomesTable';
import type { SortOrder, SortOrderWithNone } from 'src/shared/types/sort-order';

import styles from './SpeciesSearchResultsTable.module.css';

export type SortProps = {
  sortBy: string;
  sortOrder: SortOrder;
};

type Props = {
  results: SelectableGenome[];
  maxStagedGenomesNumber?: number; // if you need to limit how many of the displayed genomes can be added
  sortRule: SortProps | null;
  onSortRuleChange: (sortBy: string, sortOrder: SortOrderWithNone) => void;
  onTableExpandToggle: () => void;
  onSpeciesSelectToggle: (
    species: SpeciesSearchMatch,
    isAdding?: boolean
  ) => void;
};

const getSortOrderForColumn = (
  sortParam: string,
  sortProps: SortProps | null
) => {
  if (sortProps?.sortBy === sortParam) {
    return sortProps.sortOrder;
  } else {
    return 'none';
  }
};

const SpeciesSearchResultsTable = (props: Props) => {
  const {
    results,
    maxStagedGenomesNumber = Infinity,
    onSpeciesSelectToggle,
    sortRule,
    onSortRuleChange
  } = props;

  const onSpeciesPreselect = (species: SelectableGenome) => {
    const isAdding = !species.isStaged;
    onSpeciesSelectToggle(species, isAdding);
  };

  const stagedGenomesCount = results.reduce((acc, genome) => {
    return genome.isStaged ? acc + 1 : acc;
  }, 0);

  const canAddToStaged = stagedGenomesCount < maxStagedGenomesNumber;

  return (
    <Table stickyHeader={true} className={styles.table}>
      <thead>
        <tr>
          <ColumnHead>Select to add</ColumnHead>
          <ColumnHead
            sortOrder={getSortOrderForColumn('common_name', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('common_name', newOrder)
            }
          >
            Common name
          </ColumnHead>
          <ColumnHead
            sortOrder={getSortOrderForColumn('scientific_name', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('scientific_name', newOrder)
            }
          >
            Scientific name
          </ColumnHead>
          <ColumnHead
            sortOrder={getSortOrderForColumn('type', sortRule)}
            onSortOrderChange={(newOrder) => onSortRuleChange('type', newOrder)}
          >
            Type
          </ColumnHead>
          <ColumnHead
            sortOrder={getSortOrderForColumn('is_reference', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('is_reference', newOrder)
            }
          >
            Reference
          </ColumnHead>
          <ColumnHead
            sortOrder={getSortOrderForColumn('assembly.name', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('assembly.name', newOrder)
            }
          >
            Assembly
          </ColumnHead>

          <ColumnHead
            sortOrder={getSortOrderForColumn('release.name', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('release.name', newOrder)
            }
          >
            Release
          </ColumnHead>

          <ColumnHead>Release type</ColumnHead>

          <ColumnHead
            sortOrder={getSortOrderForColumn('assembly.accession_id', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('assembly.accession_id', newOrder)
            }
          >
            Assembly accession
          </ColumnHead>

          <ColumnHead
            sortOrder={getSortOrderForColumn('coding_genes_count', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('coding_genes_count', newOrder)
            }
          >
            Coding genes
          </ColumnHead>
          <ColumnHead
            sortOrder={getSortOrderForColumn('contig_n50', sortRule)}
            onSortOrderChange={(newOrder) =>
              onSortRuleChange('contig_n50', newOrder)
            }
          >
            N50
          </ColumnHead>
          <ColumnHead>Variation</ColumnHead>
          <ColumnHead>Regulation</ColumnHead>
          <ColumnHead>Annotation provider</ColumnHead>
          <ColumnHead>Annotation method</ColumnHead>
        </tr>
      </thead>
      <tbody>
        {results.map((searchMatch) => (
          <tr
            key={searchMatch.genome_id}
            className={classNames({
              [styles.disabled]: shouldDisableRow(searchMatch, canAddToStaged)
            })}
          >
            <td>
              <Checkbox
                disabled={shouldDisableRow(searchMatch, canAddToStaged)}
                checked={searchMatch.isStaged}
                onChange={() => onSpeciesPreselect(searchMatch)}
                aria-label={getAriaLabelForRowSelector(searchMatch)}
              />
            </td>
            <td>
              <CommonName {...searchMatch} />
            </td>
            <td>
              <ScientificName {...searchMatch} />
            </td>
            <td>
              <SpeciesType {...searchMatch} />
            </td>
            <td>{searchMatch.is_reference ? <SolidDot /> : <EmptyDot />}</td>
            <td>
              <AssemblyName {...searchMatch} />
            </td>
            <td>
              <GenomeRelease release={searchMatch.release} />
            </td>
            <td>
              <GenomeReleaseType release={searchMatch.release} />
            </td>
            <td className={styles.assemblyAccessionId}>
              {!shouldDisableRow(searchMatch, canAddToStaged) ? (
                <ExternalLink
                  to={searchMatch.assembly.url}
                  className={styles.externalLink}
                >
                  <AssemblyAccessionId {...searchMatch} />
                </ExternalLink>
              ) : (
                <DisabledExternalLink>
                  <AssemblyAccessionId {...searchMatch} />
                </DisabledExternalLink>
              )}
            </td>

            <td>{formatNumber(searchMatch.coding_genes_count)}</td>
            <td>
              {searchMatch.contig_n50
                ? formatNumber(searchMatch.contig_n50)
                : '-'}
            </td>
            <td className={styles.centered}>
              {searchMatch.has_variation ? <SolidDot /> : <EmptyDot />}
            </td>
            <td className={styles.centered}>
              {searchMatch.has_regulation ? <SolidDot /> : <EmptyDot />}
            </td>
            <td>{searchMatch.annotation_provider}</td>
            <td>{searchMatch.annotation_method}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const shouldDisableRow = (
  searchMatch: SelectableGenome,
  canAddToStaged: boolean
) => {
  return searchMatch.isSelected || (!searchMatch.isStaged && !canAddToStaged);
};

const getAriaLabelForRowSelector = (searchMatch: SelectableGenome) => {
  const {
    common_name,
    scientific_name,
    assembly: { name: assemblyName }
  } = searchMatch;
  return `${common_name ?? scientific_name} ${assemblyName}`;
};

export default SpeciesSearchResultsTable;
