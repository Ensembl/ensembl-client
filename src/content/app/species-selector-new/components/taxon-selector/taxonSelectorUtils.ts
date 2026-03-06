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

import { type TaxonNode } from 'stories/species-selector-new/taxon-selector/data';

export const standardTaxonRanks = [
  'superkingdom', // why is this called 'domain' on the NCBI site?
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'species'
];

export const searchTree = ({
  tree,
  taxonId
}: {
  tree: TaxonNode;
  taxonId: number;
}) => {
  const nodes = [tree];

  while (nodes.length) {
    const node = nodes.shift() as TaxonNode;
    if (node.taxon_id === taxonId) {
      return node;
    }

    for (const child of node.children) {
      nodes.push(child);
    }
  }

  return null;
};

export const findNodesByRank = ({
  nodes: initialNodes,
  rank
}: {
  nodes: TaxonNode[];
  rank: string;
}) => {
  const nodes = structuredClone(initialNodes);

  const result: TaxonNode[] = [];

  while (nodes.length) {
    const node = nodes.shift() as TaxonNode;
    if (node.rank === rank) {
      result.push(node);
    }

    for (const child of node.children) {
      nodes.push(child);
    }
  }

  return result;
};
