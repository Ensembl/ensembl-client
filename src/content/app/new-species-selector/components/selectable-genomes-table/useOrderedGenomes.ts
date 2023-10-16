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

import { useState, useCallback } from 'react';
import type { SelectableGenome } from './useSelectableGenomesTable';

type SortableColumn =
  | 'common_name'
  | 'scientific_name'
  | 'type'
  | 'assembly_name'
  | 'assembly_accession_id'
  | 'coding_genes_count'
  | 'contig_n50';

type SortOrder = 'asc' | 'desc';

export type SortRule = {
  column: SortableColumn;
  sortOrder: 'asc' | 'desc';
};

export type ChangeSortRule = (
  column: SortableColumn,
  sortOrder: SortOrder | 'none'
) => void;

const useOrderedGenomes = (genomes: SelectableGenome[]) => {
  const [sortRule, setSortRule] = useState<SortRule | null>(null);

  let orderedGenomes = genomes;

  const changeSortRule: ChangeSortRule = useCallback((column, sortOrder) => {
    if (sortOrder === 'none') {
      setSortRule(null);
    } else {
      setSortRule({ column, sortOrder });
    }
  }, []);

  // NOTE: we could use Array.prototype.toSorted when we feel brave enough
  if (sortRule?.column === 'common_name') {
    if (sortRule.sortOrder === 'asc') {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringAsc(a.common_name, b.common_name);
      });
    } else {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringDesc(a.common_name, b.common_name);
      });
    }
  } else if (sortRule?.column === 'scientific_name') {
    if (sortRule.sortOrder === 'asc') {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringAsc(a.scientific_name, b.scientific_name);
      });
    } else {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringDesc(a.scientific_name, b.scientific_name);
      });
    }
  } else if (sortRule?.column === 'type') {
    if (sortRule.sortOrder === 'asc') {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringAsc(
          createGenomeTypeString(a),
          createGenomeTypeString(b)
        );
      });
    } else {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringDesc(
          createGenomeTypeString(a),
          createGenomeTypeString(b)
        );
      });
    }
  } else if (sortRule?.column === 'assembly_name') {
    if (sortRule.sortOrder === 'asc') {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringAsc(a.assembly.name, b.assembly.name);
      });
    } else {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringDesc(a.assembly.name, b.assembly.name);
      });
    }
  } else if (sortRule?.column === 'assembly_accession_id') {
    if (sortRule.sortOrder === 'asc') {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringAsc(a.assembly.accession_id, b.assembly.accession_id);
      });
    } else {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortStringDesc(a.assembly.accession_id, b.assembly.accession_id);
      });
    }
  } else if (sortRule?.column === 'coding_genes_count') {
    if (sortRule.sortOrder === 'asc') {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortNumberAsc(a.coding_genes_count, b.coding_genes_count);
      });
    } else {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortNumberDesc(a.coding_genes_count, b.coding_genes_count);
      });
    }
  } else if (sortRule?.column === 'contig_n50') {
    if (sortRule.sortOrder === 'asc') {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortNumberAsc(a.contig_n50, b.contig_n50);
      });
    } else {
      orderedGenomes = [...genomes].sort((a, b) => {
        return sortNumberDesc(a.contig_n50, b.contig_n50);
      });
    }
  }

  return {
    orderedGenomes,
    sortRule,
    changeSortRule
  };
};

const createGenomeTypeString = ({ type, is_reference }: SelectableGenome) => {
  const { kind = '', value = '' } = type || {};
  const referenceString = is_reference ? 'reference' : '';
  const combinedString = `${referenceString} ${kind} ${value}`;
  return combinedString;
};

export const getSortOrderForColumn = (
  column: SortableColumn,
  sortRule: SortRule | null
) => {
  if (sortRule?.column === column) {
    return sortRule.sortOrder;
  } else {
    return 'none';
  }
};

const sortStringAsc = (a: string | null, b: string | null) => {
  if (!a) {
    return 1;
  } else if (!b) {
    return -1;
  } else {
    return a.localeCompare(b);
  }
};

const sortStringDesc = (a: string | null, b: string | null) => {
  if (!a) {
    return -1;
  } else if (!b) {
    return 1;
  } else {
    return b.localeCompare(a);
  }
};

const sortNumberAsc = (a: number | null, b: number | null) => {
  if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  } else {
    return a - b;
  }
};

const sortNumberDesc = (a: number | null, b: number | null) => {
  if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  } else {
    return b - a;
  }
};

export default useOrderedGenomes;
