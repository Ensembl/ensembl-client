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
  GeneFunctionTabName,
  GeneRelationshipsTabName,
  GeneViewTabName
} from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';

export const geneFunctionViews: { [key: string]: string } = {
  protein: GeneFunctionTabName.PROTEINS,
  variants: GeneFunctionTabName.VARIANTS,
  phenotypes: GeneFunctionTabName.PHENOTYPES,
  gene_expression: GeneFunctionTabName.GENE_EXPRESSION,
  gene_ontology: GeneFunctionTabName.GENE_ONTOLOGY,
  gene_pathways: GeneFunctionTabName.GENE_PATHWAYS
};

export const geneRelationshipsViews: { [key: string]: string } = {
  orthologues: GeneRelationshipsTabName.ORTHOLOGUES,
  gene_families: GeneRelationshipsTabName.GENE_FAMILIES,
  gene_panels: GeneRelationshipsTabName.GENE_PANELS
};

export const getViewModeName = (
  geneViewTab: GeneViewTabName,
  childTab?: string
) => {
  const allGeneViewModes = Object.assign(
    {},
    geneFunctionViews,
    geneRelationshipsViews
  );

  return Object.keys(allGeneViewModes).find(
    (view) => allGeneViewModes[view] === childTab
  );
};
