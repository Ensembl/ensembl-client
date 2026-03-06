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

import { useState, useEffect } from 'react';

import { getTopLevelTaxons, updateNodes, type TaxonNode } from './data';

import TaxonSelector from 'src/content/app/species-selector-new/components/taxon-selector/TaxonSelector';

const TaxonSelectorContainer = () => {
  const [treeNodes, setTreeNodes] = useState<TaxonNode[]>([]);

  useEffect(() => {
    if (!treeNodes.length) {
      getTopLevelTaxons().then((taxons) => {
        setTreeNodes(taxons);
      });
    }
  }, [treeNodes.length]);

  const onTaxonClick = async (taxonId: number) => {
    const updatedTreeNodes = await updateNodes({
      currentNodes: treeNodes,
      expandNodeId: taxonId
    });

    setTreeNodes(updatedTreeNodes);
  };

  return (
    <div style={{ height: '90vh' }}>
      <TaxonSelector taxons={treeNodes} onTaxonClick={onTaxonClick} />
    </div>
  );
};

export const TaxonSelectorStory = {
  name: 'Default',
  render: () => {
    return <TaxonSelectorContainer />;
  }
};

export default {
  title: 'Components/Species Selector/Taxon selector'
};
