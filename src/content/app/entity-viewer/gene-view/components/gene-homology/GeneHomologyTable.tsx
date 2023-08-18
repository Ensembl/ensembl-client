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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { Link } from 'react-router-dom';

import DataTable from 'src/shared/components/data-table/DataTable';
import { CircularPercentageIndicator } from 'src/shared/components/proportion-indicator/CircularProportionIndicator';
import { LinearPercentageIndicator } from 'src/shared/components/proportion-indicator/LinearProportionIndicator';

import type { GeneHomology } from 'src/content/app/entity-viewer/state/api/types/geneHomology';
import {
  type DataTableColumns,
  TableAction
} from 'src/shared/components/data-table/dataTableTypes';

import styles from './GeneHomologyTable.scss';

type Props = {
  homologies: GeneHomology[];
};

const GeneHomologyTable = (props: Props) => {
  const { homologies } = props;

  return (
    <div>
      <DataTable
        state={{ rowsPerPage: Infinity, data: prepareTableData(homologies) }}
        columns={tableColumns}
        disabledActions={[
          TableAction.FILTERS,
          TableAction.FIND_IN_TABLE,
          TableAction.DOWNLOAD_SHOWN_DATA
        ]}
        className={styles.table}
      />
    </div>
  );
};

const prepareTableData = (homologies: GeneHomology[]) => {
  return homologies.map((homology) => {
    return [
      homology.target_genome.common_name ?? '-',
      homology.target_genome.scientific_name,
      homology.target_genome.assembly.name,
      homology.target_genome.assembly.accession_id,
      homology.stats.query_percent_id, // using query instead of the target here is intentional
      homology.stats.query_percent_coverage, // using query instead of the target here is intentional
      homology.target_gene.symbol ?? '-',
      {
        data: {
          genomeId: homology.target_genome.genome_id,
          geneId: homology.target_gene.stable_id
        }
      },
      homology.subtype
    ];
  });
};

const tableColumns: DataTableColumns = [
  {
    columnId: 'common_name',
    title: 'Common name',
    isSortable: true
  },
  {
    columnId: 'scientific_name',
    title: 'Scientific name',
    isSortable: true,
    renderer: ({ cellData }) => {
      return (
        <span className={styles.scientificName}>{cellData as string}</span>
      );
    }
  },
  {
    columnId: 'assembly_name',
    title: 'Assembly',
    isSortable: true,
    renderer: ({ cellData }) => {
      return <span className={styles.assembly}>{cellData as string}</span>;
    }
  },
  {
    columnId: 'assembly_id',
    title: 'Assembly accession',
    isSortable: true,
    renderer: ({ cellData }) => {
      return <span className={styles.assembly}>{cellData as string}</span>;
    }
  },
  {
    columnId: 'protein_similarity',
    title: '% Protein similarity',
    isSortable: true,
    renderer: ({ cellData }) => {
      return (
        <LinearPercentageIndicator
          value={cellData as number}
          withPercentSign={false}
        />
      );
    },
    helpText:
      'The percentage of identical amino acid residues aligned against each other'
  },
  {
    columnId: 'coverage',
    title: '% Coverage',
    isSortable: true,
    renderer: ({ cellData }) => {
      return (
        <CircularPercentageIndicator
          value={cellData as number}
          withPercentSign={false}
        />
      );
    },
    helpText:
      'The percent of query which is in local alignment with the respective reference'
  },
  {
    columnId: 'gene_symbol',
    title: 'Gene symbol'
  },
  {
    columnId: 'gene_stable_id',
    title: 'Gene ID',
    renderer: (params) => {
      const cellData = params.cellData as {
        data: { genomeId: string; geneId: string };
      };
      const { genomeId, geneId } = cellData.data;
      const entityViewerLink = urlFor.entityViewer({
        genomeId,
        entityId: `gene:${geneId}`
      });
      return <Link to={entityViewerLink}>{geneId}</Link>;
    }
  },
  {
    columnId: 'homology_hit_type',
    title: 'Hit type',
    helpText:
      'The type of homology: RBBH - reciprocal best blast hit, BBH - best blast hit'
  }
];

export default GeneHomologyTable;
