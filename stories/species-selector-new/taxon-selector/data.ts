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

import {
  searchTree,
  standardTaxonRanks
} from 'src/content/app/species-selector-new/components/taxon-selector/taxonSelectorUtils';

export type TaxonNode = {
  taxon_id: number;
  genome_count: number;
  rank: string;
  name: string;
  children: TaxonNode[];
};

/**
 * TODO:
 * For collectChildren: make sure all standard ranks are exhausted; don't just stop at the next one
 */

export const getTaxons = async (params?: { rootId?: number }) => {
  const { default: taxonTree } = (await import('./tree.json')) as {
    default: TaxonNode;
  };

  if (!params?.rootId) {
    const root = taxonTree;
    const children = getNodesWithoutChildren(root.children);
    return {
      ...taxonTree,
      children
    };
  } else {
    const root = searchTree({ tree: taxonTree, taxonId: params.rootId });
    if (!root) {
      throw new Error(
        `Something is wrong, could not find node with id ${params.rootId}`
      );
    }
    const children = getNodesWithoutChildren(root.children);
    return {
      ...root,
      children
    };
  }
};

export const getTopLevelTaxons = async () => {
  const { default: taxonTree } = (await import('./tree.json')) as {
    default: TaxonNode;
  };
  const topRank = standardTaxonRanks[0];
  const topLevelTaxons = await findNodesByRank({
    root: taxonTree,
    rank: topRank
  });

  const result: TaxonNode[] = [];

  for (const taxon of topLevelTaxons) {
    const children = await collectChildren({ root: taxon });
    const updatedTaxon = { ...taxon, children };
    result.push(updatedTaxon);
  }

  return result;
};

export const collectChildren = async ({ root }: { root: TaxonNode }) => {
  const rootRank = root.rank;
  const rootRankIndex = standardTaxonRanks.indexOf(rootRank);

  if (rootRankIndex === -1) {
    throw Error(`Invalid node rank: ${rootRank}`);
  }

  const nextRank = standardTaxonRanks.at(rootRankIndex + 1);

  if (!nextRank) {
    return [];
  }

  const children = await findNodesByRank({
    root,
    rank: nextRank
  });

  return children;
};

// just using an async function to simulate async tasks in the future
export const findNodesByRank = async ({
  root,
  rank
}: {
  root: TaxonNode;
  rank: string;
}) => {
  const { default: taxonTree } = (await import('./tree.json')) as {
    default: TaxonNode;
  };
  const originalRoot = searchTree({ tree: taxonTree, taxonId: root.taxon_id });
  const nodes = [originalRoot];

  const result: TaxonNode[] = [];

  while (nodes.length) {
    const node = nodes.shift() as TaxonNode;
    if (node.rank === rank) {
      result.push(getNodeWithoutChildren(node));
    }

    for (const child of node.children) {
      nodes.push(child);
    }
  }

  return result;
};

export const updateNodes = async ({
  currentNodes,
  expandNodeId
}: {
  currentNodes: TaxonNode[];
  expandNodeId: number;
}) => {
  const clonedNodes = structuredClone(currentNodes);
  let targetNode: TaxonNode | null = null;

  for (const node of clonedNodes) {
    const queryNode = searchTree({
      tree: node,
      taxonId: expandNodeId
    });
    if (queryNode) {
      targetNode = queryNode;
      break;
    }
  }

  if (!targetNode) {
    throw Error('Could not find expand node!');
  }

  // remove all children from parent except for the target node
  const parentNode = findParentNode({
    topLevelNodes: clonedNodes,
    childNode: targetNode
  });

  if (parentNode) {
    parentNode.children = [targetNode];
  }

  const children = await collectChildren({
    root: targetNode
  });

  targetNode.children = children;

  return clonedNodes;
};

const findParentNode = ({
  topLevelNodes,
  childNode
}: {
  topLevelNodes: TaxonNode[];
  childNode: TaxonNode;
}) => {
  const nodes = [...topLevelNodes];

  while (nodes.length) {
    const node = nodes.shift() as TaxonNode;
    if (node.children.includes(childNode)) {
      return node;
    }

    for (const child of node.children) {
      nodes.push(child);
    }
  }

  return null;
};

const getNodeWithoutChildren = (node: TaxonNode) => {
  return {
    ...node,
    children: []
  };
};

const getNodesWithoutChildren = (nodes: TaxonNode[]) => {
  return nodes.map((node) => ({
    ...node,
    children: []
  }));
};
